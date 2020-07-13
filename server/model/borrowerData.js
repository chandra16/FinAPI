const Connect = require('../service/dbPool');
const Moment = require('moment');

const formatString = function (string) {
    //  return '\'' + string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_') + '\'';
    return '\'' + string + '\'';
};

const formatEmail = function (string) {
    return '\'' + string + '\'';
};

const insertBorrower = function (userId, usercode, nama, tempatlahir, tanggallahir, jeniskelamin, pendidikan, statuspernikahan, alamat, provinsi, kabupaten, kecamatan, kelurahan, kodePos, pekerjaan, sektorPekerjaan, deskripsiPekerjaan, lamaBekerja, pendapatan, noktp, nonpwp, uploadktp, uploadnpwp, uploadselfie) {

    let connectionContext;

    console.log('===========   DATA INPUT  ============= ');
    console.log('user_id => ', userId);
    console.log('usercode => ', usercode);
    console.log('nama => ', nama);
    console.log('tempatlahir => ', tempatlahir);
    console.log('tanggallahir => ', tanggallahir);
    console.log('jeniskelamin => ', jeniskelamin);
    console.log('pendidikan => ', pendidikan);
    console.log('statuspernikahan => ', statuspernikahan);
    console.log('alamat => ', alamat);
    console.log('provinsi => ', provinsi);
    console.log('kabupaten => ', kabupaten);
    console.log('kecamatan => ', kecamatan);
    console.log('kelurahan => ', kelurahan);
    console.log('kode_pos => ', kodePos);
    console.log('pekerjaan => ', pekerjaan);
    console.log('sektor_pekerjaan => ', sektorPekerjaan);
    console.log('deskripsi_pekerjaan => ', deskripsiPekerjaan);
    console.log('lama_bekerja => ', lamaBekerja);
    console.log('pendapatan => ', pendapatan);
    console.log('noktp => ', noktp);
    console.log('nonpwp => ', nonpwp);
    console.log('upload_ktp => ', uploadktp);
    console.log('upload_npwp => ', uploadnpwp);
    console.log('upload_selfie => ', uploadselfie);
    console.log('is_register => 1');
    console.log('create_by => ', userId);
    console.log('=========== END OF DATA ============= ');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_users SET'
                + ' tipe_id = 1,'
                + ' tipe_user_id = 1,'
                + ' bank_id = (SELECT bank_id FROM tbl_bank WHERE user_id = ' + userId + '),'
                + ' user_code = ' + formatString(usercode) + ','
                + ' nama = ' + formatString(nama) + ','
                + ' tempat_lahir = ' + formatString(tempatlahir) + ','
                + ' tanggal_lahir = ' + formatString(tanggallahir.replace(/T/, ' ').replace(/\..+/, '')) + ','
                + ' jenis_kelamin = ' + formatString(jeniskelamin) + ','
                + ' pendidikan = ' + formatString(pendidikan) + ','
                + ' status_pernikahan = ' + formatString(statuspernikahan) + ','
                + ' alamat = ' + formatString(alamat) + ','
                + ' provinsi = ' + formatString(provinsi) + ','
                + ' kabupaten = ' + formatString(kabupaten) + ','
                + ' kecamatan = ' + formatString(kecamatan) + ','
                + ' kelurahan = ' + formatString(kelurahan) + ','
                + ' kode_pos = ' + formatString(kodePos) + ','
                + ' pekerjaan = ' + formatString(pekerjaan) + ','
                + ' sektor_pekerjaan = ' + formatString(sektorPekerjaan) + ','
                + ' deskripsi_pekerjaan = ' + formatString(deskripsiPekerjaan) + ','
                + ' lama_bekerja = ' + formatString(lamaBekerja) + ','
                + ' pendapatan = ' + formatEmail(pendapatan) + ','
                + ' no_ktp = ' + formatString(noktp) + ','
                + ' no_npwp = ' + formatString(nonpwp) + ','
                + ' upload_ktp = ' + formatEmail(uploadktp) + ','
                + ' upload_npwp = ' + formatEmail(uploadnpwp) + ','
                + ' upload_selfie = ' + formatEmail(uploadselfie) + ','
                + ' is_register = 1' + ','
                + ' create_by = ' + userId + ','
                + ' updated_at = ' + formatEmail(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ','
                + ' updated_by = ' + userId +
                ' WHERE user_id = ' + userId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertBorrowerDataCompany = function (userId, usercode, noKtpPIC, uploadSelfiePIC, uploadKtpPIC) {

    let connectionContext;

    console.log('|============================== DATA INPUT ==============================|');
    console.log('| userid                => ', userId);
    console.log('| usercode              => ', usercode);
    console.log('| no_ktp_pic            => ', noKtpPIC);
    console.log('| upload_selfie_pic     => ', uploadSelfiePIC);
    console.log('| upload_ktp_pic        => ', uploadKtpPIC);
    console.log('|============================== END OF DATA =============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_users SET'
                + ' tipe_id = 1,'
                + ' tipe_user_id = 2,'
                + ' bank_id = (SELECT bank_id FROM tbl_bank WHERE user_id = ' + userId + '),'
                + ' user_code = ' + formatString(usercode) + ','
                + ' no_ktp = ' + formatString(noKtpPIC) + ','
                + ' upload_ktp = ' + formatEmail(uploadSelfiePIC) + ','
                + ' upload_selfie = ' + formatEmail(uploadKtpPIC) + ','
                + ' is_register = 1' + ','
                + ' create_by = ' + userId + ','
                + ' updated_at = ' + formatEmail(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ','
                + ' updated_by = ' + userId +
                ' WHERE user_id = ' + userId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertBorrowerUpload = function (userId, usercode, nama, tempatlahir, tanggallahir, jeniskelamin, pendidikan, statuspernikahan, alamat, provinsi, kabupaten, kecamatan, kelurahan, kodePos, pekerjaan, sektorPekerjaan, deskripsiPekerjaan, lamaBekerja, pendapatan, noktp, nonpwp, uploadktp, uploadfotopekerjaan) {

    let connectionContext;

    console.log('|=============================== DATA INPUT =============================|');
    console.log('| user_id                  => ', userId);
    console.log('| usercode                 => ', usercode);
    console.log('| nama                     => ', nama);
    console.log('| tempatlahir              => ', tempatlahir);
    console.log('| tanggallahir             => ', tanggallahir);
    console.log('| jeniskelamin             => ', jeniskelamin);
    console.log('| pendidikan               => ', pendidikan);
    console.log('| statuspernikahan         => ', statuspernikahan);
    console.log('| alamat                   => ', alamat);
    console.log('| provinsi                 => ', provinsi);
    console.log('| kabupaten                => ', kabupaten);
    console.log('| kecamatan                => ', kecamatan);
    console.log('| kelurahan                => ', kelurahan);
    console.log('| kode_pos                 => ', kodePos);
    console.log('| pekerjaan                => ', pekerjaan);
    console.log('| sektor_pekerjaan         => ', sektorPekerjaan);
    console.log('| deskripsi_pekerjaan      => ', deskripsiPekerjaan);
    console.log('| lama_bekerja             => ', lamaBekerja);
    console.log('| pendapatan               => ', pendapatan);
    console.log('| noktp                    => ', noktp);
    console.log('| nonpwp                   => ', nonpwp);
    console.log('| upload_ktp               => ', uploadktp);
    console.log('| upload_foto_pekerjaan    => ', uploadfotopekerjaan);
    console.log('| is_register              => 1');
    console.log('| create_by                => ', userId);
    console.log('|============================== END OF DATA =============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_users SET'
                + ' user_code = ' + formatString(usercode) + ','
                + ' nama = ' + formatString(nama) + ','
                + ' tempat_lahir = ' + formatString(tempatlahir) + ','
                + ' tanggal_lahir = ' + formatEmail(tanggallahir) + ','
                + ' jenis_kelamin = ' + formatString(jeniskelamin) + ','
                + ' pendidikan = ' + formatString(pendidikan) + ','
                + ' status_pernikahan = ' + formatString(statuspernikahan) + ','
                + ' alamat = ' + formatString(alamat) + ','
                + ' provinsi = ' + formatString(provinsi) + ','
                + ' kabupaten = ' + formatString(kabupaten) + ','
                + ' kecamatan = ' + formatString(kecamatan) + ','
                + ' kelurahan = ' + formatString(kelurahan) + ','
                + ' kode_pos = ' + formatString(kodePos) + ','
                + ' pekerjaan = ' + formatString(pekerjaan) + ','
                + ' sektor_pekerjaan = ' + formatString(sektorPekerjaan) + ','
                + ' deskripsi_pekerjaan = ' + formatString(deskripsiPekerjaan) + ','
                + ' lama_bekerja = ' + formatString(lamaBekerja) + ','
                + ' pendapatan = ' + formatEmail(pendapatan) + ','
                + ' no_ktp = ' + formatString(noktp) + ','
                + ' no_npwp = ' + formatString(nonpwp) + ','
                + ' upload_ktp = ' + formatEmail(uploadktp) + ','
                + ' upload_foto_pekerjaan = ' + formatEmail(uploadfotopekerjaan) + ','
                + ' is_register = 1' + ','
                + ' create_by = ' + userId + ','
                + ' updated_at = ' + formatEmail(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ','
                + ' updated_by = ' + userId +
                ' WHERE user_id = ' + userId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertBorrowerEmergencyContact = function (userid, namaEm1, nohpEm1, hubunganEm1, namaEm2, nohpEm2, hubunganEm2, namaEm3, nohpEm3, hubunganEm3) {

    let connectionContext;

    console.log('|==================== DATA INPUT EMERGENCY CONTACT ======================|');
    console.log('| userid           => ', userid);
    console.log('| nama_em_1        => ', namaEm1);
    console.log('| nohp_em_1        => ', nohpEm1);
    console.log('| hubungan_em_1    => ', hubunganEm1);
    console.log('| nama_em_2        => ', namaEm2);
    console.log('| nohp_em_2        => ', nohpEm2);
    console.log('| hubungan_em_2    => ', hubunganEm2);
    console.log('| nama_em_3        => ', namaEm3);
    console.log('| nohp_em_3        => ', nohpEm3);
    console.log('| hubungan_em_3    => ', hubunganEm3);
    console.log('|============================== END OF DATA =============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_emergency_contact (users_id, nama, no_hp, hubungan, nama_2, no_hp_2, hubungan_2, nama_3, no_hp_3, hubungan_3) VALUES ('
                + userid + ','
                + formatString(namaEm1) + ','
                + formatString(nohpEm1) + ','
                + formatString(hubunganEm1) + ','
                + formatString(namaEm2) + ','
                + formatString(nohpEm2) + ','
                + formatString(hubunganEm2) + ','
                + formatString(namaEm3) + ','
                + formatString(nohpEm3) + ','
                + formatString(hubunganEm3)
                + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertBorrowerBank = function (userId, idListBank, nomorRekening, namaNasabah, jenisRekening, cabang) {

    let connectionContext;

    console.log('|==================== DATA BANK INPUT BORROWER ======================|');
    console.log('| userId           => ', userId);
    console.log('| idListBank       => ', idListBank);
    console.log('| nomorRekening    => ', nomorRekening);
    console.log('| namaNasabah      => ', namaNasabah);
    console.log('| jenisRekening    => ', jenisRekening);
    console.log('| cabang           => ', cabang);
    console.log('|=========================== END OF DATA ============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_bank (user_id, list_bank_id, kode_bank, nomor_rekening, nama_nasabah, jenis_rekening, cabang, create_by) VALUES ('
                + userId + ','
                + formatString(idListBank) + ','
                + '(SELECT kode_bank FROM tbl_list_bank WHERE id_list_bank = ' + idListBank + '),'
                + formatString(nomorRekening) + ','
                + formatString(namaNasabah) + ','
                + formatString(jenisRekening) + ','
                + formatString(cabang) + ','
                + userId
                + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertBorrowerCompany = function (userId, companyName, companyEmail, companyPhoneNumber, companyDateOfEstablishment, companyPlaceOfEstablishment, companyAddress, companyProvince, companyCity, companyPostalCode, companySector, companyDuration, companyEmployee, companDescription, uploadSiupCompany, uploadAktaCompany) {

    let connectionContext;

    console.log('|==================== DATA COMPANY DATA BORROWER ======================|');
    console.log('| user_id                         => ', userId);
    console.log('| company_name                    => ', companyName);
    console.log('| company_email                   => ', companyEmail);
    console.log('| company_phone_number            => ', companyPhoneNumber);
    console.log('| company_date_of_establishment   => ', companyDateOfEstablishment);
    console.log('| company_place_of_establishment  => ', companyPlaceOfEstablishment);
    console.log('| company_address                 => ', companyAddress);
    console.log('| company_province                => ', companyProvince);
    console.log('| company_city                    => ', companyCity);
    console.log('| company_postal_code             => ', companyPostalCode);
    console.log('| company_sector                  => ', companySector);
    console.log('| company_duration                => ', companyDuration);
    console.log('| company_employee                => ', companyEmployee);
    console.log('| company_description             => ', companDescription);
    console.log('| upload_siup_company             => ', uploadSiupCompany);
    console.log('| upload_akta_company             => ', uploadAktaCompany);
    console.log('|=========================== END OF DATA ==============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'INSERT INTO tbl_perusahaan(user_id, perusahaan_nama, perusahaan_email, perusahaan_telepon, tempat_berdiri, tanggal_berdiri, alamat, provinsi, kota, kode_pos, informasi_perusahaan, id_sektor_perusahaan, id_karyawan_perusahaan, id_lama_perusahaan, upload_siup, upload_akta, created_by)'
                + ' VALUES('
                + userId + ','
                + formatString(companyName) + ','
                + formatString(companyEmail) + ','
                + formatString(companyPhoneNumber) + ','
                + formatString(companyDateOfEstablishment) + ','
                + formatString(companyPlaceOfEstablishment) + ','
                + formatString(companyAddress) + ','
                + formatString(companyProvince) + ','
                + formatString(companyCity) + ','
                + formatString(companyPostalCode) + ','
                + formatString(companDescription) + ','
                + formatString(companySector) + ','
                + formatString(companyEmployee) + ','
                + formatString(companyDuration) + ','
                + formatString(uploadSiupCompany) + ','
                + formatString(uploadAktaCompany) + ','
                + userId
                + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const rollbackBorrowerData = function (userid) {
    let connectionContext;
    console.log('X============================= DELETE DATA OF ===========================X');
    console.log('X userid => ', userid);
    console.log('X============================== END OF DATA =============================X');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('DELETE FROM tbl_users WHERE user_id = '
                + userid + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getBorrowerDetail = function (userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' tu.user_code, tu.nama, tu.no_ktp, tu.no_npwp, tu.jenis_kelamin, tu.tempat_lahir, tu.tanggal_lahir,'
                + ' tu.alamat, tu.provinsi, tu.kabupaten, tu.kecamatan, tu.kelurahan, tu.kode_pos, tu.pekerjaan,'
                + ' tu.upload_ktp, tu.upload_foto_pekerjaan,'
                + ' ta.email, ta.no_hp, ta.code_country,'
                + ' tj.name_job, te.name_education, ms.marital_status_code, jd.name_job_duration, js.name_job_sector, tr.name_revenue '
                + 'FROM tbl_users tu '
                + 'JOIN tbl_job tj '
                + 'JOIN tbl_authentications ta '
                + 'JOIN tbl_education te '
                + 'JOIN tbl_marital_status ms '
                + 'JOIN tbl_job_duration jd '
                + 'JOIN tbl_job_sector js '
                + 'JOIN tbl_revenue tr '
                + 'ON tu.auth_id = ta.authentication_id '
                + 'AND tu.pekerjaan = tj.id_job '
                + 'AND tu.pendidikan = te.id_education '
                + 'AND tu.status_pernikahan = ms.marital_status_id '
                + 'AND tu.lama_bekerja = jd.id_job_duration '
                + 'AND tu.sektor_pekerjaan = js.id_job_sector '
                + 'AND tu.pendapatan = tr.id_revenue '
                + 'WHERE tu.user_code = ' + formatString(userCode) + ' '
                + 'AND tu.deleted = 0' + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const deleteBorrower = function (userId) {

    let connectionContext;

    console.log('X============================ DELETE BORROWER ===========================X');
    console.log('X userId => ', userId);
    console.log('X============================== END OF DATA =============================X');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_users SET'
                + ' deleted_at = \'' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\','
                + ' deleted = 1 ' +
                ' WHERE user_id = ' + userId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const rollbackBorrowerDataCompany = function (userId) {
    let connectionContext;
    console.log('X======================== DELETE DATA COMPANY OF ========================X');
    console.log('X userid => ', userId);
    console.log('X============================== END OF DATA =============================X');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('DELETE FROM `tbl_perusahaan` WHERE `user_id`='
                + userId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const rollbackBorrowerDataBank = function (userId) {
    let connectionContext;
    console.log('X========================= DELETE DATA BANK OF ==========================X');
    console.log('X userid => ', userId);
    console.log('X============================== END OF DATA =============================X');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('DELETE FROM `tbl_bank` WHERE `user_id`='
                + userId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const rollbackBorrowerDataEmergencyContact = function (userId) {
    let connectionContext;
    console.log('X==================== DELETE DATA EMERGENCY CONTACT OF===================X');
    console.log('X userid => ', userId);
    console.log('X============================== END OF DATA =============================X');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('DELETE FROM `tbl_emergency_contact` WHERE `user_id`='
                + userId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateAlamatBorrower = function (userCode, alamat, provinsi, kabupaten, kecamatan, kelurahan, kodePos) {

    let connectionContext;

    console.log('|================ UPDATE DATA ALAMAT INVESTOR PERSONAL =================|');
    console.log('| usercode        => ', userCode);
    console.log('| alamat          => ', alamat);
    console.log('| provinsi        => ', provinsi);
    console.log('| kabupaten       => ', kabupaten);
    console.log('| kecamatan       => ', kecamatan);
    console.log('| kelurahan       => ', kelurahan);
    console.log('| kodePos         => ', kodePos);
    console.log('|============================ END OF DATA =============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_users tu1, (SELECT user_id FROM tbl_users WHERE user_code = ' + formatEmail(userCode) + ') AS tu2 '
                + 'SET'
                + ' tu1.alamat = ' + formatString(alamat) + ','
                + ' tu1.provinsi = ' + formatString(provinsi) + ','
                + ' tu1.kabupaten = ' + formatString(kabupaten) + ','
                + ' tu1.kecamatan = ' + formatString(kecamatan) + ','
                + ' tu1.kelurahan = ' + formatString(kelurahan) + ','
                + ' tu1.kode_pos = ' + formatString(kodePos) + ','
                + ' tu1.updated_at = \'' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\','
                + ' tu1.updated_by = tu2.user_id ' +
                ' WHERE tu1.user_code = ' + formatEmail(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const updateDataDiriBorrower = function (userCode, nama, tempatLahir, tanggalLahir, jenisKelamin, pendidikan, statusPernikahan, pekerjaan, sektorPekerjaan, durasiPekerjaan, deskripsiPekerjaan, penghasilan, alamat, provinsi, kabupaten, kecamatan, kelurahan, kodePos, noNPWP, noKTP) {

    let connectionContext;

    console.log('');
    console.log('|================== UPDATE DATA DIRI INVESTOR PERSONAL ==================|');
    console.log('| usercode               => ', userCode);
    console.log('| nama                   => ', nama);
    console.log('| tempatLahir            => ', tempatLahir);
    console.log('| tanggalLahir           => ', tanggalLahir);
    console.log('| jenisKelamin           => ', jenisKelamin);
    console.log('| pendidikan             => ', pendidikan);
    console.log('| statusPernikahan       => ', statusPernikahan);
    console.log('| pekerjaan              => ', pekerjaan);
    console.log('| sektorPekerjaan        => ', sektorPekerjaan);
    console.log('| durasiPekerjaan        => ', durasiPekerjaan);
    console.log('| deskripsiPekerjaan     => ', deskripsiPekerjaan);
    console.log('| penghasilan            => ', penghasilan);
    console.log('| alamat                 => ', alamat);
    console.log('| provinsi               => ', provinsi);
    console.log('| kabupaten              => ', kabupaten);
    console.log('| kecamatan              => ', kecamatan);
    console.log('| kelurahan              => ', kelurahan);
    console.log('| kodePos                => ', kodePos);
    console.log('| noNPWP                 => ', noNPWP);
    console.log('| noKTP                  => ', noKTP);
    console.log('|============================== END OF DATA =============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_users tu, (SELECT user_id FROM tbl_users WHERE user_code = ' + formatEmail(userCode) + ') AS tuc '
                + 'SET'
                + ' tu.nama = ' + formatString(nama) + ','
                + ' tu.tempat_lahir = ' + formatString(tempatLahir) + ','
                + ' tu.tanggal_lahir = ' + formatString(tanggalLahir.replace(/T/, ' ').replace(/\..+/, '')) + ','
                + ' tu.jenis_kelamin = ' + formatString(jenisKelamin) + ','
                + ' tu.pendidikan = ' + formatString(pendidikan) + ','
                + ' tu.status_pernikahan = ' + formatString(statusPernikahan) + ','
                + ' tu.pekerjaan = ' + formatString(pekerjaan) + ','
                + ' tu.sektor_pekerjaan = ' + formatString(sektorPekerjaan) + ','
                + ' tu.deskripsi_pekerjaan = ' + formatString(deskripsiPekerjaan) + ','
                + ' tu.lama_bekerja = ' + formatString(durasiPekerjaan) + ','
                + ' tu.pendapatan = ' + formatString(penghasilan) + ','
                + ' tu.alamat = ' + formatString(alamat) + ','
                + ' tu.provinsi = ' + formatString(provinsi) + ','
                + ' tu.kabupaten = ' + formatString(kabupaten) + ','
                + ' tu.kecamatan = ' + formatString(kecamatan) + ','
                + ' tu.kelurahan = ' + formatString(kelurahan) + ','
                + ' tu.kode_pos = ' + formatString(kodePos) + ','
                + ' tu.no_npwp = ' + formatString(noNPWP) + ','
                + ' tu.no_ktp = ' + formatString(noKTP) + ','
                + ' tu.updated_at = \'' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\','
                + ' tu.updated_by = ' + formatString('admin') + ' ' +
                ' WHERE tu.user_id = tuc.user_id;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateDataAuthBorrower = function (userCode, email, nomorTelepon) {

    let connectionContext;

    console.log('');
    console.log('|======================= UPDATE DATA AUTH BORROWER ======================|');
    console.log('| usercode               => ', userCode);
    console.log('| email                  => ', email);
    console.log('| nomorTelepon           => ', nomorTelepon);
    console.log('|============================== END OF DATA =============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_authentications ta, (SELECT auth_id FROM tbl_users WHERE user_code = ' + formatEmail(userCode) + ') AS tu '
                + 'SET'
                + ' ta.email = ' + formatEmail(email) + ','
                + ' ta.no_hp = ' + formatEmail(nomorTelepon) +
                ' WHERE ta.authentication_id = tu.auth_id;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateDataBankBorrower = function (userCode, kodeBank, nomorRekening, namaNasabah, jenisRekening, cabang) {

    let connectionContext;

    console.log('');
    console.log('|====================== UPDATE DATA BANK BORROWER =======================|');
    console.log('| userCode          => ', userCode);
    console.log('| kodeBank          => ', kodeBank);
    console.log('| nomorRekening     => ', nomorRekening);
    console.log('| namaNasabah       => ', namaNasabah);
    console.log('| jenisRekening     => ', jenisRekening);
    console.log('| cabang            => ', cabang);
    console.log('|============================== END OF DATA =============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_bank tb, (SELECT user_id FROM tbl_users WHERE user_code = ' + formatEmail(userCode) + ') AS tu '
                + 'SET'
                + ' tb.kode_bank = ' + formatString(kodeBank) + ','
                + ' tb.nomor_rekening = ' + formatEmail(nomorRekening) + ','
                + ' tb.nama_nasabah = ' + formatEmail(namaNasabah) + ','
                + ' tb.jenis_rekening = ' + formatEmail(jenisRekening) + ','
                + ' tb.cabang = ' + formatEmail(cabang) +
                ' WHERE tb.user_id = tu.user_id;'
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateDataEmergencyContactBorrower = function (userCode, namaEm1, nohpEm1, hubunganEm1, namaEm2, nohpEm2, hubunganEm2, namaEm3, nohpEm3, hubunganEm3) {

    let connectionContext;

    console.log('');
    console.log('|================ UPDATE DATA EMERGENCY CONTACT BORROWER ================|');
    console.log('| userCode             => ', userCode);
    console.log('| namaEm1              => ', namaEm1);
    console.log('| nohpEm1              => ', nohpEm1);
    console.log('| hubunganEm1          => ', hubunganEm1);
    console.log('| namaEm2              => ', namaEm2);
    console.log('| nohpEm2              => ', nohpEm2);
    console.log('| hubunganEm2          => ', hubunganEm2);
    console.log('| namaEm3              => ', namaEm3);
    console.log('| nohpEm3              => ', nohpEm3);
    console.log('| hubunganEm3          => ', hubunganEm3);
    console.log('|============================== END OF DATA =============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_emergency_contact tec, (SELECT user_id FROM tbl_users WHERE user_code = ' + formatEmail(userCode) + ') AS tu '
                + 'SET'
                + ' tec.nama = ' + formatString(namaEm1) + ','
                + ' tec.no_hp = ' + formatEmail(nohpEm1) + ','
                + ' tec.hubungan = ' + formatEmail(hubunganEm1) + ','
                + ' tec.nama_2 = ' + formatString(namaEm2) + ','
                + ' tec.no_hp_2 = ' + formatEmail(nohpEm2) + ','
                + ' tec.hubungan_2 = ' + formatEmail(hubunganEm2) + ','
                + ' tec.nama_3 = ' + formatString(namaEm3) + ','
                + ' tec.no_hp_3 = ' + formatEmail(nohpEm3) + ','
                + ' tec.hubungan_3 = ' + formatEmail(hubunganEm3) +
                ' WHERE tec.users_id = tu.user_id;'
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailInstallment = function (userCode) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' loan_code, plan, status, payment_date, payment_amount '
                + 'FROM tbl_installment '
                + 'WHERE user_code = ' + formatEmail(userCode) + ' '
                + 'AND status = 1 '
                + 'GROUP BY payment_date DESC;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailRequestLoan = function (userCode) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' trl.loan_code, tlt.loan_type_name, trl.jumlah_pinjaman, trl.lama_tenor, trl.suku_bunga, trl.grade, trl.tujuan, trl.status_approval, trl.created_at '
                + 'FROM tbl_request_loans trl '
                + 'JOIN tbl_loan_type tlt '
                + 'ON trl.id_loan_type = tlt.loan_type_id '
                + 'WHERE trl.user_code = ' + formatEmail(userCode) + ' '
                + 'ORDER BY trl.created_at ASC;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getBorrowerRequestLoan = function (userCode) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' trl.loan_code, tlt.loan_type_name, trl.jumlah_pinjaman, trl.lama_tenor, trl.suku_bunga, trl.grade, trl.admin_fee, trl.tujuan, trl.jatuh_tempo, trl.dokumen1, trl.dokumen2, trl.dokumen3, trl.dokumen4, trl.dokumen5, trl.dokumen6, trl.dokumen7, trl.dokumen8, trl.dokumen9, trl.dokumen10, trl.project_image, trl.status_disburse, trl.borrower_approval, trl.status_approval, trl.reason_reject '
                + 'FROM tbl_request_loans trl '
                + 'JOIN tbl_loan_type tlt '
                + 'ON trl.id_loan_type = tlt.loan_type_id '
                + 'WHERE trl.user_code = ' + formatEmail(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateApprovedBorrowerLoans = function (loanCode, approval) {

    let connectionContext;

    console.log('');
    console.log('|============ UPDATE REQUEST LOANS WITH INTEREST BY BORROWER ============|');
    console.log('| loanCode              => ', loanCode);
    console.log('| approval              => ', approval);
    console.log('| Updated At            => ', Moment().format());
    console.log('|============================== END OF DATA =============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_request_loans '
                + 'SET'
                + ' borrower_approval = ' + approval + ','
                + ' borrower_approval_at = ' + formatString(Moment().format()) + ' '
                + 'WHERE loan_code = ' + formatEmail(loanCode) + ';'
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateBorrowerData = function (userId, usercode, nama, tempatlahir, tanggallahir, jeniskelamin, alamat, provinsi, kabupaten, kecamatan, kelurahan, kodePos, noktp, nonpwp, uploadktp, uploadselfie) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_users SET'
                + ' tipe_id = 1,'
                + ' tipe_user_id = 3,'
                + ' bank_id = (SELECT bank_id FROM tbl_bank WHERE user_id = ' + userId + '),'
                + ' user_code = ' + formatString(usercode) + ','
                + ' nama = ' + formatString(nama) + ','
                + ' tempat_lahir = ' + formatString(tempatlahir) + ','
                + ' tanggal_lahir = ' + formatEmail(tanggallahir) + ','
                + ' jenis_kelamin = ' + formatString(jeniskelamin) + ','
                + ' alamat = ' + formatString(alamat) + ','
                + ' provinsi = ' + formatString(provinsi) + ','
                + ' kabupaten = ' + formatString(kabupaten) + ','
                + ' kecamatan = ' + formatString(kecamatan) + ','
                + ' kelurahan = ' + formatString(kelurahan) + ','
                + ' kode_pos = ' + formatString(kodePos) + ','
                + ' no_ktp = ' + formatString(noktp) + ','
                + ' no_npwp = ' + formatString(nonpwp) + ','
                + ' upload_ktp = ' + formatEmail(uploadktp) + ','
                + ' upload_selfie = ' + formatEmail(uploadselfie) + ','
                + ' is_register = 1' + ','
                + ' approval = 1' + ','
                + ' approval_at = ' + formatEmail(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ','
                + ' approval_by = ' + formatString('auto_approve') + ','
                + ' create_by = ' + userId + ','
                + ' updated_at = ' + formatEmail(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ','
                + ' updated_by = ' + userId +
                ' WHERE user_id = ' + userId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    getBorrowerDetail,
    getDetailInstallment,
    getDetailRequestLoan,
    getBorrowerRequestLoan,
    insertBorrower,
    insertBorrowerUpload,
    insertBorrowerEmergencyContact,
    insertBorrowerBank,
    insertBorrowerCompany,
    insertBorrowerDataCompany,
    updateDataDiriBorrower,
    updateAlamatBorrower,
    updateBorrowerData,
    updateDataBankBorrower,
    updateDataAuthBorrower,
    updateDataEmergencyContactBorrower,
    updateApprovedBorrowerLoans,
    deleteBorrower,
    rollbackBorrowerData,
    rollbackBorrowerDataBank,
    rollbackBorrowerDataEmergencyContact,
    rollbackBorrowerDataCompany
};
