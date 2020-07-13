const ReportingData = require('../model/reportingData');
const UserData = require('../model/userData');
const Moment = require('moment');
const Config = require('../../config');
const Json2xls = require('json2xls');
const XlsxTemplate = require('xlsx-template');
const xlsx = require('xlsx');

const Path = require('path');
const Fs = require('fs');

// Reporting Aging
const generateReporting = (userCode) => {
    return new Promise(async (resolve, reject) => {
        const genVal = await __generatingValue(userCode);

        try {
            if (genVal.statusCode === 'C0001') {
                const genExcel = await __generateExcelReportAging();
                return resolve(genExcel);
            }

            return reject('Insert into tbl_aging is Failed');
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const __generateExcelFormulir3A = (year) => {
    return new Promise(async (resolve, reject) => {
        try {
            let outputDir = Config.get('/pathReporting');
            if (outputDir.lastIndexOf('{home.dir}') === 0) {
                const os = require('os');

                outputDir = os.homedir() + outputDir.substr(10);
            }

            const finalOutPutDir = outputDir + 'formulir_3A_' + year;
            const fileDest = finalOutPutDir + '.xlsx';


            const dataJson = await __getValueFormulir3A(year);
            const fileName = 'form_3a_year_template.xlsx';
            Fs.readFile(Path.join(__dirname, './../../document/template/' + fileName), async (err, data) => {
                // Create a template
                var template = await new XlsxTemplate(data);

                // Replacements take place on first sheet
                var sheetNumber = await 'Sheet1';

                // Set up some placeholder values matching the placeholders in the template

                // Perform substitution
                await template.substitute(sheetNumber, dataJson);

                // Get binary data
                var gen = await template.generate({ type: 'nodebuffer' });
                console.log(gen);
                // Generate new File
                await Fs.writeFileSync(fileDest, gen);
            });

            return resolve({
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'Generating Excel file Form 3A tahunan Success'
            });
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const __generateExcelFormulir3BTahunan = (year) => {
    return new Promise(async (resolve, reject) => {
        let outputDir = Config.get('/pathReporting');
        if (outputDir.lastIndexOf('{home.dir}') === 0) {
            const os = require('os');

            outputDir = os.homedir() + outputDir.substr(10);
        }

        // Set New Month
        const finalOutPutDir = outputDir + 'formulir_3B_' + year;

        const fileDest = finalOutPutDir + '.xlsx';

        try {
            const dataJson = await __getValueFormulir3B(null, year);
            const fileName = 'form_3b_year_template.xlsx';
            Fs.readFile(Path.join(__dirname, './../../document/template/' + fileName), async (err, data) => {

                // Create a template
                var template = await new XlsxTemplate(data);

                // Replacements take place on first sheet
                var sheetNumber = await 'Sheet1';

                // Set up some placeholder values matching the placeholders in the template

                // Perform substitution
                await template.substitute(sheetNumber, dataJson);

                // Get binary data
                var gen = await template.generate({ type: 'nodebuffer' });
                // Generate new File
                await Fs.writeFileSync(fileDest, gen);
            });

            return resolve({
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'Generating Excel file Form 3B tahunan Success'
            });
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const __generateExcelFormulir3BBulanan = (month, year) => {
    return new Promise(async (resolve, reject) => {

        // Check For ROOT Directory
        let outputDir = Config.get('/pathReporting');
        if (outputDir.lastIndexOf('{home.dir}') === 0) {
            const os = require('os');

            outputDir = os.homedir() + outputDir.substr(10);
        }

        // Set New Month
        const finalOutPutDir = outputDir + 'formulir_3B_' + month + '_' + year;

        const fileDest = finalOutPutDir + '.xlsx';

        try {
            // Get Data from tbl_aging
            const dataJson = await __getValueFormulir3B(month, year);
            const fileName = 'form_3b_month_template.xlsx';
            Fs.readFile(Path.join(__dirname, './../../document/template/' + fileName), async (err, data) => {

                // Create a template
                var template = await new XlsxTemplate(data);

                // Replacements take place on first sheet
                var sheetNumber = await 'Sheet1';

                // Set up some placeholder values matching the placeholders in the template

                // Perform substitution
                await template.substitute(sheetNumber, dataJson);

                // Get binary data
                var gen = await template.generate({ type: 'nodebuffer' });
                // Generate new File
                await Fs.writeFileSync(fileDest, gen);
            });

            return resolve({
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'Generating Excel file Form 3B bulanan Success'
            });
        } catch (err) {
            console.log('<> err :', err);
            return reject({ 'err.message': err });
        }
    });
};

const __generateExcelFormulir3C = (year) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Name File
            const momentNow = Moment();
            const dayNow = momentNow.format('D');
            const monthNow = momentNow.format('M');
            const yearNow = momentNow.format('YYYY');

            let outputDir = Config.get('/pathReporting');

            if (outputDir.lastIndexOf('{home.dir}') === 0) {
                const os = require('os');
                
                outputDir = os.homedir() + outputDir.substr(10);
            }

            const fileDest = outputDir + '/formulir_3C_' + year + '.xlsx';
            const dataJson = await __getValueFormulir3C(year);
            console.log('dataJson:');
            console.log(dataJson);
            var xls = await Json2xls(dataJson);
            // Write file from xls variable
            await Fs.writeFileSync(fileDest, xls, 'binary');

            return resolve({
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'Generating Excel file Report Profil Individu Success'
            });

        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const __getValueFormulir3A = (year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const labaRugi = await ReportingData.getLabaRugi(year);
            const posisiKeuangan = await ReportingData.getPosisiKeuangan(year);
            return resolve({ labaRugi, posisiKeuangan });

        } catch (err) {
            console.log('error: ', err);
            return reject({ 'err.message': err });
        }
    });
};

const __getValueFormulir3B = (month, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (month) {
                const dataPermohonanPinjaman = await ReportingData.getPermohonanPeminjam(month, year);
                const dataPersetujuanPinjaman = await ReportingData.getPersetujuanPeminjam(month, year);
                const dataStatusPinjaman = await ReportingData.getStatusPeminjam(month, year);
                const dataStatusAkumulasiPinjaman = await ReportingData.getStatusAkumulasiPeminjam(month, year);

                return resolve({ dataPermohonanPinjaman, dataPersetujuanPinjaman, dataStatusPinjaman, dataStatusAkumulasiPinjaman });
            }

            const dataPermohonanPinjaman = await ReportingData.getPermohonanPeminjam(null, year);
            const dataPersetujuanPinjaman = await ReportingData.getPersetujuanPeminjam(null, year);
            const dataStatusPinjaman = await ReportingData.getStatusPeminjam(null, year);
            const dataStatusAkumulasiPinjaman = await ReportingData.getStatusAkumulasiPeminjam(null, year);

            return resolve({ dataPermohonanPinjaman, dataPersetujuanPinjaman, dataStatusPinjaman, dataStatusAkumulasiPinjaman });

        } catch (err) {
            console.log('error: ', err);
            return reject({ 'err.message': err });
        }
    });
};

const __getValueFormulir3C = (year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const formulir3C = await ReportingData.getDataForm3C();

            return resolve(formulir3C);

        } catch (err) {
            console.log('error: ', err);
            return reject({ 'err.message': err });
        }
    });
};

const __generateExcelReportAging = () => {
    return new Promise(async (resolve, reject) => {
        // Name File
        const momentNow = Moment();
        const dayNow = momentNow.format('D');
        const monthNow = momentNow.format('M');
        const yearNow = momentNow.format('YYYY');

        // Check For ROOT Directory
        let outputDir = Config.get('/uploadFile');
        if (outputDir.lastIndexOf('{home.dir}') === 0) {
            const os = require('os');

            outputDir = os.homedir() + outputDir.substr(10);
        }

        // Set New Month
        const finalOutPutDir = outputDir + 'Reporting';
        if (!Fs.existsSync(finalOutPutDir)) {
            Fs.mkdirSync(finalOutPutDir);
        }

        // Set New Directory inside /uploadFile
        const dirYear = finalOutPutDir + '/' + yearNow;
        if (!Fs.existsSync(dirYear)) {
            Fs.mkdirSync(dirYear);
        }

        // Set New Directory inside /uploadFile
        const dirMonth = dirYear + '/' + monthNow;
        if (!Fs.existsSync(dirMonth)) {
            Fs.mkdirSync(dirMonth);
        }

        const fileDest = finalOutPutDir + '/Aging__' + monthNow + '-' + dayNow + '- ' + yearNow + '.xlsx';

        try {
            // Get Data from tbl_aging
            const dataJson = await ReportingData.getAllReportAging();

            // Change format JSON to XSLX
            var xls = Json2xls(dataJson);

            // Write file from xls variable
            await Fs.writeFileSync(fileDest, xls, 'binary');

            return resolve({
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'Generating Excel file Report Aging Success'
            });

        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

// Reporting Profil Individu
const generateReportingProfilIndividu = () => {
    return new Promise(async (resolve, reject) => {
        const genVal = await __generatingValueProfilIndividu();
        try {
            if (genVal.statusCode === 'C0001') {
                const genExcel = await __generateExcelReportProfil();
                console.log('===> ', genExcel);
                return resolve(genExcel);
            }

            return reject('Insert into tbl_profil_individu is Failed');
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const generateForm3A = (year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const generateTahunan = await __generateExcelFormulir3A(year);
            if (generateTahunan['response'] === 'Success') {
                return resolve(generateTahunan);
            }

            return resolve({
                'statusCode': 'E0001',
                'response': 'Failed',
                'message': 'Generating Excel file Form 3A tahunan Failed'
            });
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const generateForm3B = (month, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (month) {
                const generateBulanan = await __generateExcelFormulir3BBulanan(month, year);
                if (generateBulanan['response'] === 'Success') {
                    return resolve(generateBulanan);
                }

                return resolve({
                    'statusCode': 'E0001',
                    'response': 'Failed',
                    'message': 'Generating Excel file Form 3B bulanan Failed'
                });
            }

            const generateTahunan = await __generateExcelFormulir3BTahunan(year);
            if (generateTahunan['response'] === 'Success') {
                return resolve(generateTahunan);
            }

            return resolve({
                'statusCode': 'E0001',
                'response': 'Failed',
                'message': 'Generating Excel file Form 3B tahunan Failed'
            });
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const generateForm3C = (year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const generateIndividu = await __generatingValueProfilIndividu();
            const generatePinjaman = await __generatingValueProfilPinjaman(null, year);
            const generateTahunan = await __generateExcelFormulir3C(year);
            // if(generateTahunan['response'] === 'Success') {
            //     return resolve(generateTahunan);
            // }
            if(generateTahunan['response'] === 'Success') {
                return resolve(generateTahunan);
            }

            const errorResponse = await {
                'statusCode': 'E0001',
                'response': 'Failed',
                'message': 'Generating Excel file Form 3C tahunan Failed'
            };

            return reject({ errorResponse });
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const __generateExcelReportProfil = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Name File
            console.log('masuk sini');
            const momentNow = Moment();
            const dayNow = momentNow.format('D');
            const monthNow = momentNow.format('M');
            const yearNow = momentNow.format('YYYY');

            let outputDir = Config.get('/pathReporting');

            if (outputDir.lastIndexOf('{home.dir}') === 0) {
                const os = require('os');

                outputDir = os.homedir() + outputDir.substr(10);
            }

            const fileDest = outputDir + '/ProfilIndividu__' + dayNow + '-' + monthNow + '-' + yearNow + '.xlsx';
            const dataJson = await ReportingData.getAllReportProfilIndividu();
            console.log('dataJson:');
            console.log(dataJson);
            var xls = await Json2xls(dataJson);
            // Write file from xls variable
            await Fs.writeFileSync(fileDest, xls, 'binary');

            return resolve({
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'Generating Excel file Report Profil Individu Success'
            });

        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const __generateExcelReportProfilPinjaman = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Name File
            console.log('masuk sini');
            const momentNow = Moment();
            const dayNow = momentNow.format('D');
            const monthNow = momentNow.format('M');
            const yearNow = momentNow.format('YYYY');

            let outputDir = Config.get('/pathReporting');

            if (outputDir.lastIndexOf('{home.dir}') === 0) {
                const os = require('os');

                outputDir = os.homedir() + outputDir.substr(10);
            }

            const fileDest = outputDir + '/ProfilPinjaman__' + dayNow + '-' + monthNow + '-' + yearNow + '.xlsx';
            const dataJson = await ReportingData.getAllReportProfilIPinjaman();
            console.log('dataJson:');
            console.log(dataJson);
            var xls = await Json2xls(dataJson);
            // Write file from xls variable
            await Fs.writeFileSync(fileDest, xls, 'binary');

            return resolve({
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'Generating Excel file Report Profil Individu Success'
            });

        } catch (err) {
            return reject({ 'err.message': err });
        }
    });

};

// Reporting Profil Pinjaman
const generateReportingProfilPinjaman = () => {
    return new Promise(async (resolve, reject) => {
        const genVal = await __generatingValueProfilPinjaman();
        try {
            if (genVal.statusCode === 'C0001') {
                const genExcel = await __generateExcelReportProfilPinjaman();
                return resolve(genExcel);
            }

            return reject('Insert into tbl_profil_pinjaman is Failed');
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

// Reporting Status Pinjaman
const generateReportingStatusPinjaman = () => {
    return new Promise(async (resolve, reject) => {
        const genVal = await __generatingValueStatusPinjaman();
        try {
            if (genVal.statusCode === 'C0001') {
                const genExcel = await __generateExcelReportStatusPinjaman();
                return resolve(genExcel);
            }

            return reject('Insert into tbl_reporting_status_pinjaman is Failed');
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const __generateExcelReportStatusPinjaman = () => {
    return new Promise(async (resolve, reject) => {
        // Name File
        const momentNow = Moment();
        const dayNow = momentNow.format('D');
        const monthNow = momentNow.format('M');
        const yearNow = momentNow.format('YYYY');

        // Check For ROOT Directory
        let outputDir = Config.get('/uploadFile');
        if (outputDir.lastIndexOf('{home.dir}') === 0) {
            const os = require('os');

            outputDir = os.homedir() + outputDir.substr(10);
        }

        // Set New Month
        const finalOutPutDir = outputDir + 'Reporting_Status_Pinjaman';
        if (!Fs.existsSync(finalOutPutDir)) {
            Fs.mkdirSync(finalOutPutDir);
        }

        // Set New Directory inside /uploadFile
        const dirYear = finalOutPutDir + '/' + yearNow;
        if (!Fs.existsSync(dirYear)) {
            Fs.mkdirSync(dirYear);
        }

        // Set New Directory inside /uploadFile
        const dirMonth = dirYear + '/' + monthNow;
        if (!Fs.existsSync(dirMonth)) {
            Fs.mkdirSync(dirMonth);
        }

        const fileDest = dirMonth + '/StatusPinjaman__' + dayNow + '-' + monthNow + '-' + yearNow + '.xlsx';

        try {
            // Get Data from tbl_aging
            const dataJson = await ReportingData.getAllReportStatusPinjaman();

            // Change format JSON to XSLX
            var xls = Json2xls(dataJson);

            // Write file from xls variable
            await Fs.writeFileSync(fileDest, xls, 'binary');

            return resolve({
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'Generating Excel file Report Status Pinjaman Success'
            });

        } catch (err) {
            console.log('<> err :', err);
            return reject({ 'err.message': err });
        }
    });
};

// Reporting Status Akumulasi Pinjaman
const generateReportingStatusAkumulasiPinjaman = () => {
    return new Promise(async (resolve, reject) => {
        const genVal = await __generatingValueStatusAkumulasiPinjaman();
        try {
            if (genVal.statusCode === 'C0001') {
                const genExcel = await __generateExcelReportStatusAkumulasiPinjaman();
                return resolve(genExcel);
            }

            return reject('Insert into tbl_reporting_status_akumulasi_pinjaman is Failed');
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const __generateExcelReportStatusAkumulasiPinjaman = () => {
    return new Promise(async (resolve, reject) => {
        // Name File
        const momentNow = Moment();
        const dayNow = momentNow.format('D');
        const monthNow = momentNow.format('M');
        const yearNow = momentNow.format('YYYY');

        // Check For ROOT Directory
        let outputDir = Config.get('/uploadFile');
        if (outputDir.lastIndexOf('{home.dir}') === 0) {
            const os = require('os');

            outputDir = os.homedir() + outputDir.substr(10);
        }

        // Set New Month
        const finalOutPutDir = outputDir + 'Reporting_Status_Akumulasi_Pinjaman';
        if (!Fs.existsSync(finalOutPutDir)) {
            Fs.mkdirSync(finalOutPutDir);
        }

        // Set New Directory inside /uploadFile
        const dirYear = finalOutPutDir + '/' + yearNow;
        if (!Fs.existsSync(dirYear)) {
            Fs.mkdirSync(dirYear);
        }

        // Set New Directory inside /uploadFile
        const dirMonth = dirYear + '/' + monthNow;
        if (!Fs.existsSync(dirMonth)) {
            Fs.mkdirSync(dirMonth);
        }

        const fileDest = dirMonth + '/StatusAkumulasiPinjaman__' + dayNow + '-' + monthNow + '-' + yearNow + '.xlsx';

        try {
            // Get Data from tbl_aging
            const dataJson = await ReportingData.getAllReportStatusAkumulasiPinjaman();

            // Change format JSON to XSLX
            var xls = Json2xls(dataJson);

            // Write file from xls variable
            await Fs.writeFileSync(fileDest, xls, 'binary');

            return resolve({
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'Generating Excel file Report Status Akumulasi Pinjaman Success'
            });

        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

// ------------------------------------------------------------//
//Reporting Aging
const __generatingValue = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            // DELETE EXISTING DATA IN tbl_aging
            console.log('masuk sini 1');
            const DeleteData = await ReportingData.deleteAllReportingAging(userCode);

            if (DeleteData) {
                console.log('masuk sini 2');
                // Get List Loan Where Approve Loan = 3
                const ListLoan = await ReportingData.getListLoan(3);

                var insertAging;

                // Loop as much as list loan
                for (const listLoans of ListLoan) {
                    // Get Detail User
                    const DetailUser = await UserData.getDetailUserByUserCode(listLoans.user_code);
                    // Get Nomor Kontrak
                    const NoKontrak = await ReportingData.getContractNumber(listLoans.loan_code);
                    // Get Detail Installment
                    const DetailInstallment = await ReportingData.getDetailInstallment(listLoans.loan_code);
                    // Get Date of Disburse
                    const DetailDisburse = await ReportingData.getDateOfDisburse(listLoans.user_code, listLoans.loan_code);
                    // Get Count Unpaid Installment
                    const DetailUnpaidInstallment = await ReportingData.getCountUnpaidInstallment(listLoans.loan_code);
                    // Get File Collateral Name
                    const CollateralName = await ReportingData.getCollateralFileName(listLoans.loan_code);
                    // Get value File
                    await console.log(CollateralName[0].name_collateral_file);
                    const CollateralValue = await __getValueFile(CollateralName[0].name_collateral_file);

                    // VARIABLE FOR SPECIFIC DATA
                    const Nama = 'Danon';
                    const Referensi = '-';
                    const CaraBayar = 'Danon';
                    const AdvArr = '?';
                    const Status = '?';
                    const TglKontrak = '?';
                    const Hari = await __countAging(DetailDisburse[0].transaction_at);
                    const OdStatus = await __countODStatus(DetailUnpaidInstallment[0].count);
                    const OsPokok = Math.ceil(await __countOSPokok(listLoans.jumlah_pinjaman, listLoans.suku_bunga, DetailInstallment[0].amount, DetailInstallment[0].plan - 1, listLoans.lama_tenor));
                    var tempAlamat = DetailUser[0].alamat.split(' | ');
                    const Alamat = tempAlamat[0] + ', RT:' + tempAlamat[1] + ', RW:' + tempAlamat[2] + ', Perum/No.Rumah:' + tempAlamat[3];

                    // console.log('');
                    // console.log('*[ ' + listLoans.loan_code + ' ]*');
                    // console.log('*--------------------------------------------------------------*');
                    // console.log('*--- No Kontrak         => ', NoKontrak[0].document_no);
                    // console.log('*--- Nama Cabang        => ', Nama);
                    // console.log('*--- Nama Kolektor      => ', Nama);
                    // console.log('*--- Nama Marketing     => ', Nama);
                    // console.log('*--- Nama Dealer        => ', Nama);
                    // console.log('*--- Nama Channel       => ', Nama);
                    // console.log('*--- Referensi          => ', Referensi);
                    // console.log('*--- Nama               => ', DetailUser[0].nama);
                    // console.log('*--- Cara Bayar         => ', CaraBayar);
                    // console.log('*--- Lama Tenor         => ', listLoans.lama_tenor);
                    // console.log('*--- ADV ARR            => ', AdvArr);
                    // console.log('*--- Tgl_Jt_Tempo       => ', DetailInstallment[0].due_date);
                    // console.log('*--- Angsuran Ke        => ', DetailInstallment[0].plan);
                    // console.log('*--- Angsuran           => ', DetailInstallment[0].amount);
                    // console.log('*--- Hari               => ', Hari);
                    // console.log('*--- Alamat             => ', Alamat);
                    // console.log('*--- Kelurahan          => ', DetailUser[0].kelurahan);
                    // console.log('*--- Kecamatan          => ', DetailUser[0].kecamatan);
                    // console.log('*--- KAT                => ', '-');
                    // console.log('*--- Telepon            => ', DetailUser[0].code_country + DetailUser[0].no_hp);
                    // console.log('*--- No_Rangka          => ', CollateralValue.noRangka);
                    // console.log('*--- No_Mesin           => ', CollateralValue.noMesin);
                    // console.log('*--- No_Polisi          => ', CollateralValue.noPolisi);
                    // console.log('*--- No_BPKB            => ', CollateralValue.noBPKB);
                    // console.log('*--- Tahun              => ', CollateralValue.tahun);
                    // console.log('*--- Merk               => ', CollateralValue.merk);
                    // console.log('*--- Tipe               => ', CollateralValue.tipe);
                    // console.log('*--- Status             => ', Status);
                    // console.log('*--- Kw_Tunggak         => ', DetailUnpaidInstallment[0].count);
                    // console.log('*--- Tgl_Kontrak        => ', TglKontrak);
                    // console.log('*--- Os_Pokok           => ', OsPokok);
                    // console.log('*--- Od_Status          => ', OdStatus);
                    // console.log('*--------------------------------------------------------------*');
                    // console.log('');

                    insertAging = await insertReportingAging(
                        Nama,
                        Nama,
                        Nama,
                        Nama,
                        Nama,
                        NoKontrak[0].document_no,
                        Referensi,
                        DetailUser[0].nama,
                        CaraBayar,
                        listLoans.lama_tenor,
                        AdvArr,
                        DetailInstallment[0].due_date,
                        DetailInstallment[0].plan,
                        DetailInstallment[0].amount,
                        Hari,
                        Alamat,
                        DetailUser[0].kelurahan,
                        DetailUser[0].kecamatan,
                        '-',
                        DetailUser[0].code_country + DetailUser[0].no_hp,
                        CollateralValue.noRangka,
                        CollateralValue.noMesin,
                        CollateralValue.noPolisi,
                        CollateralValue.noBPKB,
                        CollateralValue.tahun,
                        CollateralValue.merk,
                        CollateralValue.tipe,
                        Status,
                        DetailUnpaidInstallment[0].count,
                        TglKontrak,
                        OsPokok,
                        OdStatus,
                        userCode);
                }

                return resolve(insertAging);
            }

            return reject('Oops !! Something Happened . ');

        } catch (err) {
            return reject(err);
        }
    });
};

const insertReportingAging = function (
    nmCabang, nmKolektor, nmMarketing, nmDealer, nmChannel, nokontrak, referensi, nama, carabayar, lamatenor, advarr, tgljatuhtempo, angsuranke,
    angsuran, hari, alamat, kelurahan, kecamatan, kat, telepon, norangka, nomesin, nopolisi, nobpkb, tahun, merk, tipe, status, kwtunggak, tanggalkontrak, ospokok, odstatus,
    userCode) {
    return new Promise(function (resolve, reject) {
        ReportingData.insertReportingAging(nmCabang, nmKolektor, nmMarketing, nmDealer, nmChannel, nokontrak, referensi, nama, carabayar, lamatenor, advarr, tgljatuhtempo, angsuranke, angsuran, hari, alamat, kecamatan, kelurahan, kat, telepon, norangka, nomesin, nopolisi, nobpkb, tahun, merk, tipe, status, kwtunggak, tanggalkontrak, ospokok, odstatus, userCode)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Insert data Reporting Aging successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

// Reporting Profik Individu
const __generatingValueProfilIndividu = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            // DELETE EXISTING DATA IN tbl_aging
            const DeleteData = await ReportingData.deleteAllReportingIndividu(userCode);

            if (DeleteData) {
                // Get List Individu
                const ListIndividu = await ReportingData.getListUser(1);

                var insertIndividu;

                // Loop as much as list loan
                for (const listIndividus of ListIndividu) {
                    // Get Detail User
                    const DetailUser = await ReportingData.getDetailUserByUserCode(listIndividus.user_code);
                    // Get Detail Badan Hukum
                    // const DetailBadanHukum = await ReportingData.getBadanHukum(listIndividus.user_code);
                    // Variabel
                    const idPenyelenggara = '?';
                    const idBadanHukum = '?';
                    const jenisBadanHukum = '?';
                    const namaBadanHukum = '?';
                    const usia = await __countUsia(DetailUser[0].tanggal_lahir);
                    const kodePenyelenggara = '?';
                    const jasaLayananKeuangan = '?';
                    const domisiliPenyelenggara = '?';


                    // console.log('');
                    // console.log('*[ ' + listIndividus.user_code + ' ]*');
                    // console.log('*--------------------------------------------------------------*');
                    // console.log('*--- Tgl Record             => ', DetailUser[0].create_at);
                    // console.log('*--- ID Penyelenggara       => ', idPenyelenggara);
                    // console.log('*--- ID Pengguna            => ', DetailUser[0].user_code);
                    // console.log('*--- Nama Pengguna          => ', DetailUser[0].nama);
                    // console.log('*--- Jenis Pengguna         => ', DetailUser[0].tipe_id);
                    // console.log('*--- ID Badan Hukum         => ', idBadanHukum);
                    // console.log('*--- Jenis Badan Hukum      => ', jenisBadanHukum);
                    // console.log('*--- Nama Badan Hukum       => ', namaBadanHukum);
                    // console.log('*--- ID KTP                 => ', DetailUser[0].no_ktp);
                    // console.log('*--- Tempat Lahir           => ', DetailUser[0].tempat_lahir);
                    // console.log('*--- Tanggal Lahir          => ', DetailUser[0].tanggal_lahir);
                    // console.log('*--- Usia                   => ', usia);
                    // console.log('*--- Jenis Kelamin          => ', DetailUser[0].jenis_kelamin);
                    // console.log('*--- Pendidikan             => ', DetailUser[0].pendidikan);
                    // console.log('*--- Pekerjaan              => ', DetailUser[0].pekerjaan);
                    // console.log('*--- Bidang Pekerjaan       => ', DetailUser[0].sektor_pekerjaan);
                    // console.log('*--- Kode Penyelenggara     => ', kodePenyelenggara);
                    // console.log('*--- Jasa Layanan Keuangan  => ', jasaLayananKeuangan);
                    // console.log('*--- Domisili Penyelenggara => ', domisiliPenyelenggara);
                    // console.log('*--- Agama                  => ', DetailUser[0].agama);
                    // console.log('*--- Alamat                 => ', DetailUser[0].alamat);
                    // console.log('*--- Kota                   => ', DetailUser[0].kabupaten);
                    // console.log('*--- Provinsi               => ', DetailUser[0].provinsi);
                    // console.log('*--------------------------------------------------------------*');
                    // console.log('');

                    insertIndividu = await insertProfilIndividu(
                        listIndividus.user_code,
                        DetailUser[0].create_at,
                        idPenyelenggara,
                        DetailUser[0].user_code,
                        DetailUser[0].nama,
                        DetailUser[0].tipe_id,
                        idBadanHukum,
                        jenisBadanHukum,
                        namaBadanHukum,
                        DetailUser[0].no_ktp,
                        DetailUser[0].tempat_lahir,
                        DetailUser[0].tanggal_lahir,
                        usia,
                        DetailUser[0].jenis_kelamin,
                        DetailUser[0].pendidikan,
                        DetailUser[0].pekerjaan,
                        DetailUser[0].sektor_pekerjaan,
                        kodePenyelenggara,
                        jasaLayananKeuangan,
                        domisiliPenyelenggara,
                        DetailUser[0].agama,
                        DetailUser[0].alamat,
                        DetailUser[0].kabupaten,
                        DetailUser[0].provinsi);
                }
                // console.log('insertIndividu => ', insertIndividu);

                return resolve(insertIndividu);
            }

            return reject('NOT OKE');

        } catch (err) {
            return reject(err);
        }
    });
};

const insertProfilIndividu = function (
    userCode, tanggalRecord, idPenyelenggara, idPengguna, namaPengguna, jenisPengguna, idBadanHukum, jenisBadanHukum, namaBadanHukum,
    idKtp, tempatLahir, tanggalLahir, usia, jenisKelamin, pendidikan, pekerjaan, bidangPekerjaan, kodePenyelenggara,
    jasaLayananKeuangan, domisiliPenyelenggara, agama, alamat, kota,
    provinsi) {
    return new Promise(function (resolve, reject) {
        ReportingData.insertProfilIndividu(userCode, tanggalRecord, idPenyelenggara, idPengguna, namaPengguna, jenisPengguna, idBadanHukum, jenisBadanHukum, namaBadanHukum, idKtp, tempatLahir, tanggalLahir, usia, jenisKelamin, pendidikan, pekerjaan, bidangPekerjaan, kodePenyelenggara, jasaLayananKeuangan, domisiliPenyelenggara, agama, alamat, kota, provinsi)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Insert data Reporting Profil Individu successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

// Reporting Profil Pinjaman
const __generatingValueProfilPinjaman = (userCode, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            // DELETE EXISTING DATA IN tbl_aging
            const DeleteData = await ReportingData.deleteAllReportingLoans(userCode);

            if (DeleteData) {
                // Get List Individu
                const ListLoan = await ReportingData.getListLoanReporting(3, year);

                var insertLoanProfils;

                for (const listLoans of ListLoan) {
                    // Get Detail User
                    const DetailUser = await UserData.getDetailUserByUserCode(listLoans.user_code);
                    // Get Detail Installment
                    const DetailInstallment = await ReportingData.getDetailInstallment(listLoans.loan_code);

                    const frekuensiBayaran = 'Bulanan';
                    const jenisBayaran = 'VA';
                    const informasiKredit = '?';
                    const jmlPermohonanPinjamanDisetujui = listLoans.jumlah_pinjaman;
                    const tglPenawaranPemberianPinjaman = '?';
                    const permintaanJaminan = '?';
                    const jmlPenawaranPemberianPinjaman = '?';
                    const sisaPinjamanBerjalan = '?';
                    const statusPinjaman = '?';

                    // console.log('');
                    // console.log('*[ ' + listLoans.loan_code + ' ]*');
                    // console.log('*--------------------------------------------------------------*');
                    // console.log('*--- Tgl Permohonan Pinjaman           => ', listLoans.created_at);
                    // console.log('*--- Jml Permohonan Pinjaman           => ', listLoans.jumlah_pinjaman);
                    // console.log('*--- Rating Permohonan Pinjaman        => ', listLoans.grade);
                    // console.log('*--- Informasi Kredit                  => ', informasiKredit);
                    // console.log('*--- Jml Permohonan Pinjaman Disetujui => ', jmlPermohonanPinjamanDisetujui);
                    // console.log('*--- Tgl Penawaran Pemberian Pinjaman  => ', tglPenawaranPemberianPinjaman);
                    // console.log('*--- Permintaan Jaminan                => ', permintaanJaminan);
                    // console.log('*--- Jml Penawaran Pemberian Pinjaman  => ', jmlPenawaranPemberianPinjaman);
                    // console.log('*--- Penggunaan Pinjaman               => ', listLoans.tujuan);
                    // console.log('*--- Frekuensi Pembayaran              => ', frekuensiBayaran);
                    // console.log('*--- Jenis Pembayaran                  => ', jenisBayaran);
                    // console.log('*--- Tingkat Bunga Pinjaman            => ', listLoans.suku_bunga);
                    // console.log('*--- Tgl Jatuh Tempo Pinjaman          => ', DetailInstallment[0].due_date);
                    // console.log('*--- Tenor Pinjaman                    => ', listLoans.lama_tenor);
                    // console.log('*--- Sisa Pinjaman Berjalan            => ', sisaPinjamanBerjalan);
                    // console.log('*--- Status Pinjaman                   => ', statusPinjaman);
                    // console.log('*--------------------------------------------------------------*');
                    // console.log('');

                    insertLoanProfils = await insertLoanProfil(
                        listLoans.user_code,
                        Moment(listLoans.created_at).format(),
                        listLoans.jumlah_pinjaman,
                        listLoans.grade,
                        informasiKredit,
                        jmlPermohonanPinjamanDisetujui,
                        tglPenawaranPemberianPinjaman,
                        permintaanJaminan,
                        jmlPenawaranPemberianPinjaman,
                        listLoans.tujuan,
                        frekuensiBayaran,
                        jenisBayaran,
                        listLoans.suku_bunga,
                        Moment(DetailInstallment[0].due_date).format(),
                        listLoans.lama_tenor,
                        sisaPinjamanBerjalan,
                        statusPinjaman);
                    console.log('insertLoanProfil => ', insertLoanProfils);
                }

                return resolve(insertLoanProfils);
            }

            return reject('NOT OKE');

        } catch (err) {
            return reject(err);
        }
    });
};

const insertLoanProfil = function (
    userCode,
    tglPermohonanPinjaman,
    jmlPermohonanPinjaman,
    ratingPermohonanPinjaman,
    informasiKredit,
    jmlPermohonanPinjamanDisetujui,
    tglPenawaranPemberianPinjaman,
    permintaanJaminan,
    jmlPenawaranPemberianPinjaman,
    penggunaanPinjaman,
    frekuensiPembayaran,
    jenisBayaran,
    tingkatBungaPinjaman,
    tglJatuhTempoPinjaman,
    tenorPinjaman,
    sisaPinjamanBerjalan,
    statusPinjaman) {
    return new Promise(function (resolve, reject) {
        ReportingData.insertProfilPinjaman(userCode, tglPermohonanPinjaman, jmlPermohonanPinjaman, ratingPermohonanPinjaman, informasiKredit, jmlPermohonanPinjamanDisetujui, tglPenawaranPemberianPinjaman, permintaanJaminan, jmlPenawaranPemberianPinjaman, penggunaanPinjaman, frekuensiPembayaran, jenisBayaran, tingkatBungaPinjaman, tglJatuhTempoPinjaman, tenorPinjaman, sisaPinjamanBerjalan, statusPinjaman)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Insert data Reporting Profile Peminjam successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

// generating value reporting (permohonan pinjaman, persetujuan pinjaman, status pinjaman, status akumulasi pinjaman) tiap tahunnya

const generatingValueAllReporting = () => {
    return new Promise(async (resolve, reject) => {
        // Loop Data to insert
        var insertPermohonanPinjaman;
        var insertPersetujuanPinjaman;
        var insertStatusLoans;
        var insertStatusAkumulasiLoans;
        for (let i = 1; i <= 12; i++) {
            for (let j = 1; j <= 3; j++) {
                insertPermohonanPinjaman = await insertPermohonanPinjam(i, j, '-', '-', '-', '-', '-');
                insertPersetujuanPinjaman = await insertPersetujuanPinjam(i, j, '-', '-', '-', '-', '-');
                insertStatusLoans = await insertStatusLoan(i, j, '-', '-', '-', '-', '-');
                insertStatusAkumulasiLoans = await insertStatusAkumulasiLoan(i, j, '-', '-', '-', '-', '-', '-', '-', '-');
            }

            const insertPosisiKeuangan = await ReportingData.insertPosisiKeuangan(i, '-', '-', '-', '-');
            const insertLabaRugi = await ReportingData.insertLabaRugi(i, '-', '-', '-');
        }

        return resolve(insertStatusAkumulasiLoans);
    });
};

// Update Data Reporting Every Day
const updateDataReportingEveryDay = () => {
    return new Promise(async (resolve, reject) => {
        // Data to update tabel reporting permohonan pinjaman
        var totalJumlahOrang = 0;
        var totalJumlahPerusahaan = 0;
        var totalJUmlahUang = 0;
        var totalAvgTertimbangBunga = 0;
        var TotalAvgTertimbangTenor = 0;
        const jumlahOrang = await ReportingData.getDetailPersonalPerMonth();
        const jumlahPerusahaan = await ReportingData.getDetailCorporatePerMonth();
        const jumlahUang = await ReportingData.getDetailMoneyPerMonth();
        const rataRataTertimbangBunga = await ReportingData.getDetailrataBungaPerMonth();
        const rataRataTertimbangTenor = await ReportingData.getDetailrataTenorPerMonth();

        if (jumlahOrang) {
            totalJumlahOrang = jumlahOrang.total;
        }

        if (jumlahPerusahaan) {
            totalJumlahPerusahaan = jumlahPerusahaan.total;
        }

        if (jumlahUang) {
            totalJUmlahUang = jumlahUang.total;
        }

        if (rataRataTertimbangBunga) {
            totalAvgTertimbangBunga = rataRataTertimbangBunga.totalInterest;
        }

        if (rataRataTertimbangTenor) {
            TotalAvgTertimbangTenor = rataRataTertimbangTenor.totalTenor;
        }


        // Data to update tabel reporting Persetujuan Pinjaman
        var totalJumlahOrangApprove = 0;
        var totalJumlahPerusahaanApprove = 0;
        var totalJUmlahUangApprove = 0;
        var totalAvgTertimbangBungaApprove = 0;
        var TotalAvgTertimbangTenorApprove = 0;
        const jumlahOrangApprove = await ReportingData.getDetailPersonalPerMonthApproved(1);
        const jumlahPerusahaanApprove = await ReportingData.getDetailCorporatePerMonthApproved(2);
        const jumlahUangApprove = await ReportingData.getDetailMoneyPerMonthApproved();
        const rataRataTertimbangBungaApprove = await ReportingData.getDetailrataBungaPerMonthApproved();
        const rataRataTertimbangTenorApprove = await ReportingData.getDetailrataTenorPerMonthApproved();

        if (jumlahOrangApprove) {
            totalJumlahOrangApprove = jumlahOrangApprove.total;
        }

        if (jumlahPerusahaanApprove) {
            totalJumlahPerusahaanApprove = jumlahPerusahaanApprove.total;
        }

        if (jumlahUangApprove) {
            totalJUmlahUangApprove = jumlahUangApprove.total;
        }

        if (rataRataTertimbangBungaApprove) {
            totalAvgTertimbangBungaApprove = rataRataTertimbangBungaApprove.totalInterest;
        }

        if (rataRataTertimbangTenorApprove) {
            TotalAvgTertimbangTenorApprove = rataRataTertimbangTenorApprove.totalTenor;
        }

        // Data to update tabel reporting Status Akumulasi Pinjaman
        var statusAll = await ReportingData.getAllRequestLoans();

        var totalJumlahOrangAkumulasiPinjaman = 0;
        var totalJumlahPerusahaanAkumulasiPinjaman = 0;
        var totalJumlahUangAkumulasiPinjaman = 0;
        var totalRataRataTertimbangBungaAkumulasiPinjaman = 0;
        var totalRataRataTertimbangTenorAkumulasiPinjaman = 0;
        var totalRataStatusLancarAkumulasiPinjaman = 0;
        var totalRataStatusTidakLancarAkumulasiPinjaman = 0;
        var totalRataKreditMacetAkumulasiPinjaman = 0;

        const jumlahOrangAkumulasiPinjaman = await ReportingData.getDetailPersonalPerMonthApproved();
        const jumlahPerusahaanAkumulasiPinjaman = await ReportingData.getDetailCorporatePerMonthApproved();
        const jumlahUangAkumulasiPinjaman = await ReportingData.getDetailMoneyPerMonthApproved();
        const rataRataTertimbangBungaAkumulasiPinjaman = await ReportingData.getDetailrataBungaPerMonthApproved();
        const rataRataTertimbangTenorAkumulasiPinjaman = await ReportingData.getDetailrataTenorPerMonthApproved();
        const rataStatusLancarAkumulasiPinjaman = await ReportingData.getDetailrataLancarPerMonth();
        const rataStatusTidakLancarAkumulasiPinjaman = await ReportingData.getDetailrataTidakLancarPerMonth();
        const rataKreditMacetAkumulasiPinjaman = await ReportingData.getDetailrataMacetPerMonth();

        if (jumlahOrangAkumulasiPinjaman) {
            totalJumlahOrangAkumulasiPinjaman = jumlahOrangAkumulasiPinjaman.total;
        }

        if (jumlahPerusahaanAkumulasiPinjaman) {
            totalJumlahPerusahaanAkumulasiPinjaman = jumlahPerusahaanAkumulasiPinjaman.total;
        }

        if (jumlahUangAkumulasiPinjaman) {
            totalJumlahUangAkumulasiPinjaman = jumlahUangAkumulasiPinjaman.total;
        }

        if (rataRataTertimbangBungaAkumulasiPinjaman) {
            totalRataRataTertimbangBungaAkumulasiPinjaman = rataRataTertimbangBungaAkumulasiPinjaman.totalInterest;
        }

        if (rataRataTertimbangTenorAkumulasiPinjaman) {
            totalRataRataTertimbangTenorAkumulasiPinjaman = rataRataTertimbangTenorAkumulasiPinjaman.totalTenor;
            console.log('totalRataRataTertimbangTenorAkumulasiPinjaman = ' + totalRataRataTertimbangTenorAkumulasiPinjaman);
        }

        if (rataStatusLancarAkumulasiPinjaman) {
            totalRataStatusLancarAkumulasiPinjaman = rataStatusLancarAkumulasiPinjaman.rataLancar;
            console.log('totalRataStatusLancarAkumulasiPinjaman = ' + totalRataStatusLancarAkumulasiPinjaman);
        }

        if (rataStatusTidakLancarAkumulasiPinjaman) {
            totalRataStatusTidakLancarAkumulasiPinjaman = rataStatusTidakLancarAkumulasiPinjaman.total;
            console.log('totalRataStatusTidakLancarAkumulasiPinjaman = ' + totalRataStatusTidakLancarAkumulasiPinjaman);
        }

        if (rataKreditMacetAkumulasiPinjaman) {
            totalRataKreditMacetAkumulasiPinjaman = rataKreditMacetAkumulasiPinjaman.total;
            console.log('totalRataKreditMacetAkumulasiPinjaman = ' + totalRataKreditMacetAkumulasiPinjaman);
        }


        // Data to update tabel reporting Status Pinjaman
        var totalRataStatuslancar = 0;
        var totalRataStatusTidakLancar = 0;
        var totalRataKreditMacet = 0;

        const rataStatusLancar = await ReportingData.getDetailrataLancarPerMonth();
        const rataStatusTidakLancar = await ReportingData.getDetailrataTidakLancarPerMonth();
        const rataKreditMacet = await ReportingData.getDetailrataMacetPerMonth();

        if (rataStatusLancar) {
            totalRataStatuslancar = rataStatusLancar.rataLancar;
        }

        if (rataStatusTidakLancar) {
            totalRataStatusTidakLancar = rataStatusTidakLancar.rataTidakLancar;
        }

        if (rataKreditMacet) {
            totalRataKreditMacet = rataKreditMacet.rataMacet;
        }


        // Data to Update tabel 
        await ReportingData.updateReportingPermohonanPinjaman(jumlahOrang.MONTH, jumlahOrang.province_region_id, totalJumlahOrang, totalJumlahPerusahaan, totalJUmlahUang, totalAvgTertimbangBunga, TotalAvgTertimbangTenor);
        await ReportingData.updateReportingPersetujuanPinjaman(jumlahOrang.MONTH, jumlahOrang.province_region_id, totalJumlahOrangApprove, totalJumlahPerusahaanApprove, totalJUmlahUangApprove, totalAvgTertimbangBungaApprove, TotalAvgTertimbangTenorApprove);
        await ReportingData.updateReportingAkumulasiPinjaman(jumlahOrang.MONTH, jumlahOrang.province_region_id, totalJumlahOrangAkumulasiPinjaman, totalJumlahPerusahaanAkumulasiPinjaman, totalJumlahUangAkumulasiPinjaman,
            totalRataRataTertimbangBungaAkumulasiPinjaman, totalRataRataTertimbangTenorAkumulasiPinjaman, totalRataStatusLancarAkumulasiPinjaman / statusAll[0].total, totalRataStatusTidakLancarAkumulasiPinjaman / statusAll[0].total, totalRataKreditMacetAkumulasiPinjaman / statusAll[0].total);
        await ReportingData.updateReportingStatusPinjaman(jumlahOrang.MONTH, jumlahOrang.province_region_id, totalRataStatuslancar / statusAll[0].total, totalRataStatusTidakLancar / statusAll[0].total, totalRataKreditMacet / statusAll[0].total);

        const finalResponse = {
            'statusCode': 'C0001',
            'response': 'Success',
            'message': 'data reporting successfully'
        };

        return resolve(finalResponse);
    });

};


// Reporting Permohonan Pinjaman

const insertPermohonanPinjam = function (
    bulan,
    provinsi,
    jumlahOrang,
    jumlahPerusahaan,
    jumlahUang,
    rataRataTertimbangBunga,
    rataRataTertimbangTenor) {
    return new Promise(function (resolve, reject) {
        ReportingData.insertPermohonanPinjaman(bulan, provinsi, jumlahOrang, jumlahPerusahaan, jumlahUang, rataRataTertimbangBunga, rataRataTertimbangTenor)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Insert data Reporting Permohonan Peminjam successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const insertPersetujuanPinjam = function (
    bulan,
    provinsi,
    jumlahOrang,
    jumlahPerusahaan,
    jumlahUang,
    rataRataTertimbangBunga,
    rataRataTertimbangTenor) {
    return new Promise(function (resolve, reject) {
        ReportingData.insertPersetujuanPinjaman(bulan, provinsi, jumlahOrang, jumlahPerusahaan, jumlahUang, rataRataTertimbangBunga, rataRataTertimbangTenor)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Insert data Reporting Persetujuan Peminjam successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

// Reporting Status Pinjaman
const __generatingValueStatusPinjaman = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // DELETE EXISTING DATA IN tbl_status_pinjaman
            const DeleteData = await ReportingData.deleteAllReportingStatus();

            if (DeleteData) {
                // Get List Individu
                const statusLoan = await ReportingData.getListLoan(3);

                var insertStatusLoans;
                var statusAll = await ReportingData.getAllRequestLoans();

                const rataStatusLancar = await ReportingData.getDetailrataLancarPerMonth();
                const rataStatusTidakLancar = await ReportingData.getDetailrataTidakLancarPerMonth();
                const rataKreditMacet = await ReportingData.getDetailrataMacetPerMonth();

                console.log('');
                console.log('*------------------------------------------------------------------------------------------------*');

                for (let i = 1; i <= 12; i++) {
                    for (let j = 1; j <= 3; j++) {
                        insertStatusLoans = await insertStatusLoan(i, j, '-', '-', '-', '-', '-');

                        for (let a = 0; a < rataStatusLancar.length; a++) {
                            if (rataStatusLancar[a].MONTH === i && rataStatusLancar[a].province_region_id === j) {
                                await ReportingData.updaterataLancarPerMonth(i, j, rataStatusLancar[a].rataLancar / statusAll[0].total);
                            }
                        }

                        for (let b = 0; b < rataStatusTidakLancar.length; b++) {
                            if (rataStatusTidakLancar[b].MONTH === i && rataStatusTidakLancar[b].province_region_id === j) {
                                await ReportingData.updaterataTidakLancarPerMonth(i, j, rataStatusTidakLancar[b].rataTidakLancar / statusAll[0].total);
                            }
                        }

                        for (let c = 0; c < rataKreditMacet.length; c++) {
                            if (rataKreditMacet[c].MONTH === i && rataKreditMacet[c].province_region_id === j) {
                                await rataKreditMacet.updaterataMacetPerMonth(i, j, rataKreditMacet[c].rataMacet / statusAll[0].total);
                            }
                        }
                    }
                }

                return resolve(insertStatusLoans);
            }

            return reject('NOT OKE');

        } catch (err) {
            return reject(err);
        }
    });
};

const insertStatusLoan = function (
    bulan,
    province,
    rataStatusLancar,
    rataStatusTidakLancar,
    rataKreditMacet) {
    return new Promise(function (resolve, reject) {
        ReportingData.insertStatusLoans(bulan, province, rataStatusLancar, rataStatusTidakLancar, rataKreditMacet)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Insert data Reporting Status Peminjam successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

// Reporting Status Akumulasi Pinjaman
const __generatingValueStatusAkumulasiPinjaman = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // DELETE EXISTING DATA IN tbl_status_pinjaman
            const DeleteData = await ReportingData.deleteAllReportingStatusAkumulasi();

            if (DeleteData) {
                // Get List Individu
                const statusAkumulasiLoan = await ReportingData.getListLoan(3);

                var insertStatusAkumulasiLoans;
                var statusAll = await ReportingData.getAllRequestLoans();

                const jumlahOrang = await ReportingData.getDetailPersonalPerMonthApproved();
                const jumlahPerusahaan = await ReportingData.getDetailCorporatePerMonthApproved();
                const jumlahUang = await ReportingData.getDetailMoneyPerMonthApproved();
                const rataRataTertimbangBunga = await ReportingData.getDetailrataBungaPerMonthApproved();
                const rataRataTertimbangTenor = await ReportingData.getDetailrataTenorPerMonthApproved();
                const rataStatusLancar = await ReportingData.getDetailrataLancarPerMonth();
                const rataStatusTidakLancar = await ReportingData.getDetailrataTidakLancarPerMonth();
                const rataKreditMacet = await ReportingData.getDetailrataMacetPerMonth();

                console.log('');
                console.log('*------------------------------------------------------------------------------------------------*');

                for (let i = 1; i <= 12; i++) {
                    for (let j = 1; j <= 3; j++) {
                        insertStatusAkumulasiLoans = await insertStatusAkumulasiLoan(i, j, '-', '-', '-', '-', '-', '-', '-', '-');

                        for (let a = 0; a < jumlahOrang.length; a++) {
                            if (jumlahOrang[a].MONTH === i && jumlahOrang[a].province_region_id === j) {
                                await ReportingData.updatePersonalPerMonthAkumulasi(i, j, jumlahOrang[a].total);
                            }
                        }

                        for (let b = 0; b < jumlahPerusahaan.length; b++) {
                            if (jumlahPerusahaan[b].MONTH === i && jumlahPerusahaan[b].province_region_id === j) {
                                await ReportingData.updateCorporatePerMonthAkumulasi(i, j, jumlahPerusahaan[b].total);
                            }
                        }

                        for (let c = 0; c < jumlahUang.length; c++) {
                            if (jumlahUang[c].MONTH === i && jumlahUang[c].province_region_id === j) {
                                await ReportingData.updateMoneyPerMonthAkumulasi(i, j, jumlahUang[c].total);
                            }
                        }

                        for (let d = 0; d < rataRataTertimbangBunga.length; d++) {
                            if (rataRataTertimbangBunga[d].MONTH === i && rataRataTertimbangBunga[d].province_region_id === j) {
                                await ReportingData.updaterataBungaPerMonthAkumulasi(i, j, rataRataTertimbangBunga[d].totalInterest);
                            }
                        }

                        for (let e = 0; e < rataRataTertimbangTenor.length; e++) {
                            if (rataRataTertimbangTenor[e].MONTH === i && rataRataTertimbangTenor[e].province_region_id === j) {
                                await ReportingData.updaterataTenorPerMonthAkumulasi(i, j, rataRataTertimbangTenor[e].totalTenor);
                            }
                        }

                        for (let f = 0; f < rataStatusLancar.length; f++) {
                            if (rataStatusLancar[f].MONTH === i && rataStatusLancar[f].province_region_id === j) {
                                await ReportingData.updaterataLancarPerMonthAkumulasi(i, j, rataStatusLancar[f].rataLancar / statusAll[0].total);
                            }
                        }

                        for (let g = 0; g < rataStatusTidakLancar.length; g++) {
                            if (rataStatusTidakLancar[g].MONTH === i && rataStatusTidakLancar[g].province_region_id === j) {
                                await ReportingData.updaterataTidakLancarPerMonthAkumulasi(i, j, rataStatusTidakLancar[g].rataTidakLancar / statusAll[0].total);
                            }
                        }

                        for (let h = 0; h < rataKreditMacet.length; h++) {
                            if (rataKreditMacet[h].MONTH === i && rataKreditMacet[h].province_region_id === j) {
                                await rataKreditMacet.updaterataMacetPerMonthAkumulasi(i, j, rataKreditMacet[h].rataMacet / statusAll[0].total);
                            }
                        }
                    }
                }

                console.log('*--------------------------------------------------------------*');
                console.log('');


                return resolve(insertStatusAkumulasiLoans);
            }

            return reject('NOT OKE');

        } catch (err) {
            console.log('<> err :', err);
            return reject(err);
        }
    });
};

const insertStatusAkumulasiLoan = function (
    bulan,
    province,
    jumlahOrang,
    jumlahPerusahaan,
    jumlahUang,
    rataRataTertimbangBunga,
    rataRataTertimbangTenor,
    rataStatusLancar,
    rataStatusTidakLancar,
    rataKreditMacet) {
    return new Promise(function (resolve, reject) {
        ReportingData.insertStatusAkumulasiLoans(bulan, province, jumlahOrang, jumlahPerusahaan, jumlahUang, rataRataTertimbangBunga, rataRataTertimbangTenor, rataStatusLancar, rataStatusTidakLancar, rataKreditMacet)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Insert data Reporting Status Akumulasi Peminjam successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

//Menghitung Aging

const __countAging = (dateCreate) => {
    return new Promise((resolve, reject) => {
        try {
            var createDate = Moment(dateCreate);
            var now = Moment();
            var totalAgingDays = now.diff(createDate, 'days');

            return resolve(totalAgingDays);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const __countUsia = (dateCreate) => {
    return new Promise((resolve, reject) => {
        try {
            var createDate = Moment(dateCreate);
            var now = Moment();
            var totalUsia = now.diff(createDate, 'years');

            return resolve(totalUsia);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const __countOSPokok = (totalLoan, interest, installment, paidPlan, totalPlan) => {
    return new Promise((resolve, reject) => {
        try {
            var totalInterest = ((totalLoan * interest / 100) / 12) * totalPlan;
            var totalInstallment = paidPlan * installment;

            var totalOS = (totalLoan + totalInterest) - totalInstallment;

            return resolve(totalOS);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const __countODStatus = (kwTunggak) => {
    return new Promise(async (resolve, reject) => {
        try {
            var defaultVariable = 30;
            var lowerLimit;
            var upperLimit;

            if (kwTunggak <= 12) {
                lowerLimit = await __make3Digit(String(((kwTunggak - 1) * defaultVariable) + 1));
                upperLimit = await __make3Digit(String(kwTunggak * defaultVariable));
            } else {
                lowerLimit = 361;
                upperLimit = 999;
            }

            var ODStatus = lowerLimit + '-' + upperLimit;

            return resolve(ODStatus);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const __make3Digit = (numberVal) => {
    return new Promise((resolve, reject) => {
        try {
            if (numberVal.length < 2) {
                return resolve('00' + numberVal);
            } else if (numberVal.length < 3) {
                return resolve('0' + numberVal);
            }

            return resolve(numberVal);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const __getValueFile = (FileName) => {
    return new Promise((resolve, reject) => {
        let outputDir = Config.get('/uploadFile');
        if (outputDir.lastIndexOf('{home.dir}') === 0) {
            const os = require('os');

            outputDir = os.homedir() + outputDir.substr(10);
        }

        const JsonPath = outputDir + 'collateral_file/' + FileName;

        Fs.readFile(JsonPath, 'utf8', (err, content) => {
            if (err) {
                return reject({ err: err });
            }

            var parsedJSON = JSON.parse(content);
            return resolve(parsedJSON);
        });
    });
};

const getFileReporting = (type, dd, mm, yy) => {
    return new Promise((resolve, reject) => {
        let outputDir = Config.get('/uploadFile');
        if (outputDir.lastIndexOf('{home.dir}') === 0) {
            const os = require('os');

            outputDir = os.homedir() + outputDir.substr(10);
        }

        const finalOutPutDir = outputDir + 'Reporting';
        const fileDest = finalOutPutDir + '/' + type + '__' + mm + '-' + dd + '- ' + yy + '.xlsx';
        Fs.readFile(fileDest, function (err, files) {
            if (err) {
                return reject(err);
            }

            return resolve({
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'File Found !'
            });
        });
    });
};

const getPermohonanPeminjam = (month, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const getData = await ReportingData.getPermohonanPeminjam(month, year);
            return resolve(getData);
        } catch (err) {
            return reject(err);
        }
    });
};

const getPersetujuanPeminjam = (month, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const getData = await ReportingData.getPersetujuanPeminjam(month, year);
            return resolve(getData);
        } catch (err) {
            return reject(err);
        }
    });
};

const getStatusAkumulasiPeminjam = (month, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const getData = await ReportingData.getStatusAkumulasiPeminjam(month, year);
            return resolve(getData);
        } catch (err) {
            return reject(err);
        }
    });
};

const getStatusPeminjam = (month, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            const getData = await ReportingData.getStatusPeminjam(month, year);
            return resolve(getData);
        } catch (err) {
            return reject(err);
        }
    });
};

module.exports = {
    generateReporting,
    generateReportingProfilIndividu,
    generateReportingProfilPinjaman,
    insertReportingAging,
    insertProfilIndividu,
    insertLoanProfil,
    insertStatusLoan,
    getFileReporting,
    generatingValueAllReporting,
    updateDataReportingEveryDay,
    getPermohonanPeminjam,
    getPersetujuanPeminjam,
    getStatusAkumulasiPeminjam,
    getStatusPeminjam,
    generateForm3A,
    generateForm3B,
    generateForm3C,
    __getValueFormulir3A
};
