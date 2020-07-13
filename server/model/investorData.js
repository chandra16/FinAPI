const Connect = require('../service/dbPool');

const formatString = function (string) {
    return '\'' + string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_') + '\'';
};

const formatEmail = function (string) {
    return '\'' + string + '\'';
};

const insertInvestorPersonal = function (userCode, userId, panggilan, nama, tempatLahir, tanggalLahir, jenisKelamin, agama, pekerjaan, statusPerkawinan, penghasilan, pendidikan, sumberDana, namaGadisIbu, alamat, provinsi, kabupaten, kecamatan, kelurahan, kodePos, kewarganegaraan, noNpwp, noKtp, tempatTerbit, tanggalKadaluarsa, noKitas, noPassport, uploadKtp, uploadNpwp, uploadSelfie) {

    let connectionContext;

    console.log('|================ DATA USER INPUT INVESTOR PERSONAL =================|');
    console.log('| usercode          => ', userCode);
    console.log('| userId            => ', userId);
    console.log('| panggilan         => ', panggilan);
    console.log('| nama              => ', nama);
    console.log('| tempatlahir       => ', tempatLahir);
    console.log('| tanggallahir      => ', tanggalLahir);
    console.log('| jeniskelamin      => ', jenisKelamin);
    console.log('| agama             => ', agama);
    console.log('| pekerjaan         => ', pekerjaan);
    console.log('| statusPerkawinan  => ', statusPerkawinan);
    console.log('| penghasilan       => ', penghasilan);
    console.log('| pendidikan        => ', pendidikan);
    console.log('| sumberDana        => ', sumberDana);
    console.log('| namaGadisIbu      => ', namaGadisIbu);
    console.log('| alamat            => ', alamat);
    console.log('| provinsi          => ', provinsi);
    console.log('| kabupaten         => ', kabupaten);
    console.log('| kecamatan         => ', kecamatan);
    console.log('| kelurahan         => ', kelurahan);
    console.log('| kodePos           => ', kodePos);
    console.log('| noKtp             => ', noKtp);
    console.log('| tempatTerbit      => ', tempatTerbit);
    console.log('| tanggalKadaluarsa => ', tanggalKadaluarsa);
    console.log('| noNpwp            => ', noNpwp);
    console.log('| kewarganegaraan   => ', kewarganegaraan);
    console.log('| noKitas           => ', noKitas);
    console.log('| noPassport        => ', noPassport);
    console.log('| uploadKtp         => ', uploadKtp);
    console.log('| uploadNpwp        => ', uploadNpwp);
    console.log('| uploadSelfie      => ', uploadSelfie);
    console.log('|=========================== END OF DATA ============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_users SET'
                + ' user_code = ' + formatString(userCode) + ','
                + ' tipe_id = 1,'
                + ' tipe_user_id = 1,'
                + ' bank_id = (SELECT bank_id FROM tbl_bank WHERE user_id = ' + userId + '),'
                + ' titel = ' + formatString(panggilan) + ','
                + ' nama = ' + formatString(nama) + ','
                + ' tempat_lahir = ' + formatString(tempatLahir) + ','
                + ' tanggal_lahir = ' + formatString(tanggalLahir.replace(/T/, ' ').replace(/\..+/, '')) + ','
                + ' jenis_kelamin = ' + formatString(jenisKelamin) + ','
                + ' alamat = ' + formatString(alamat) + ','
                + ' provinsi = ' + formatString(provinsi) + ','
                + ' kabupaten = ' + formatString(kabupaten) + ','
                + ' kecamatan = ' + formatString(kecamatan) + ','
                + ' kelurahan = ' + formatString(kelurahan) + ','
                + ' kode_pos = ' + formatString(kodePos) + ','
                + ' nama_gadis_ibu = ' + formatString(namaGadisIbu) + ','
                + ' agama = ' + formatString(agama) + ','
                + ' pekerjaan = ' + formatString(pekerjaan) + ','
                + ' status_pernikahan = ' + formatString(statusPerkawinan) + ','
                + ' pendapatan = ' + formatString(penghasilan) + ','
                + ' pendidikan = ' + formatString(pendidikan) + ','
                + ' sumber_dana = ' + formatString(sumberDana) + ','
                + ' no_ktp = ' + formatString(noKtp) + ','
                + ' kota_terbit = ' + formatString(tempatTerbit) + ','
                + ' tanggal_kadaluarsa = ' + formatString(tanggalKadaluarsa) + ','
                + ' no_npwp = ' + formatString(noNpwp) + ','
                + ' kewarganegaraan = ' + formatString(kewarganegaraan) + ','
                + ' no_kitas = ' + formatString(noKitas) + ','
                + ' no_passport = ' + formatString(noPassport) + ','
                + ' upload_selfie = ' + formatEmail(uploadSelfie) + ','
                + ' upload_ktp = ' + formatEmail(uploadKtp) + ','
                + ' upload_npwp = ' + formatEmail(uploadNpwp) + ','
                + ' is_register = 1' + ','
                + ' create_by = ' + userId + ','
                + ' updated_at = \'' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\','
                + ' updated_by = ' + userId +
                ' WHERE user_id = ' + userId + ';');

        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertInvestorCorporateUser = function (userCode, userId, namaPIC, emailPIC, teleponPIC, noKTPPIC, uploadKtp, uploadNpwp) {

    let connectionContext;

    console.log('|================ DATA USER INPUT INVESTOR CORPORATE ================|');
    console.log('| usercode      => ', userCode);
    console.log('| userId        => ', userId);
    console.log('| namaPIC       => ', namaPIC);
    console.log('| emailPIC      => ', emailPIC);
    console.log('| teleponPIC    => ', teleponPIC);
    console.log('| noKTPPIC      => ', noKTPPIC);
    console.log('|=========================== END OF DATA ============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_users SET'
                + ' user_code = ' + formatString(userCode) + ','
                + ' tipe_id = 2,'
                + ' tipe_user_id = 1,'
                + ' perusahaan_id = (SELECT perusahaan_id FROM tbl_perusahaan WHERE user_id = ' + userId + '),'
                + ' bank_id = (SELECT bank_id FROM tbl_bank WHERE user_id = ' + userId + '),'
                + ' nama = ' + formatString(namaPIC) + ','
                + ' no_ktp = ' + formatString(noKTPPIC) + ','
                + ' upload_ktp = ' + formatString(uploadKtp) + ','
                + ' upload_npwp = ' + formatString(uploadNpwp) + ','
                + ' is_register = 1' + ','
                + ' create_by = ' + userId + ','
                + ' updated_at = \'' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\','
                + ' updated_by = ' + userId +
                ' WHERE user_id = ' + userId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertInvestorCorporatePerusahaan = function (userId, namaPerusahaan, emailPerusahaan, teleponPerusahaan, tanggalBerdiri, tempatBerdiri, alamat, provinsi, kota, kodePos) {

    let connectionContext;

    console.log('|============= DATA PERUSAHAAN INPUT INVESTOR CORPORATE =============|');
    console.log('| userId            => ', userId);
    console.log('| namaPerusahaan    => ', namaPerusahaan);
    console.log('| emailPerusahaan   => ', emailPerusahaan);
    console.log('| teleponPerusahaan => ', teleponPerusahaan);
    console.log('| tempatBerdiri     => ', tempatBerdiri);
    console.log('| tanggalBerdiri    => ', tanggalBerdiri);
    console.log('| alamat            => ', alamat);
    console.log('| provinsi          => ', provinsi);
    console.log('| kota              => ', kota);
    console.log('| kodePos           => ', kodePos);
    console.log('|=========================== END OF DATA ============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_perusahaan (user_id, perusahaan_nama, perusahaan_email, perusahaan_telepon, tempat_berdiri, tanggal_berdiri, alamat, provinsi, kota, kode_pos, create_by) VALUES ('
                + userId + ','
                + formatString(namaPerusahaan) + ','
                + formatEmail(emailPerusahaan) + ','
                + formatString(teleponPerusahaan) + ','
                + formatString(tempatBerdiri) + ','
                + formatString(tanggalBerdiri) + ','
                + formatString(alamat) + ','
                + formatString(provinsi) + ','
                + formatString(kota) + ','
                + formatString(kodePos) + ','
                + userId
                + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertInvestorBank = function (userId, idListBank, nomorRekening, namaNasabah, jenisRekening, cabang) {

    let connectionContext;

    console.log('|==================== DATA BANK INPUT INVESTOR ======================|');
    console.log('| userId         => ', userId);
    console.log('| idListBank     => ', idListBank);
    console.log('| nomorRekening  => ', nomorRekening);
    console.log('| namaNasabah    => ', namaNasabah);
    console.log('| jenisRekening  => ', jenisRekening);
    console.log('| cabang         => ', cabang);
    console.log('|=========================== END OF DATA ============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_bank (user_id, list_bank_id, kode_bank , nomor_rekening, nama_nasabah, jenis_rekening, cabang, create_by) VALUES ('
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

const updateAlamatInvestorPersonal = function (userCode, kewarganegaraan, alamat, provinsi, kabupaten, kecamatan, kelurahan, kodePos) {

    let connectionContext;

    console.log('|================ UPDATE DATA ALAMAT INVESTOR PERSONAL =================|');
    console.log('| usercode        => ', userCode);
    console.log('| alamat          => ', alamat);
    console.log('| provinsi        => ', provinsi);
    console.log('| kabupaten       => ', kabupaten);
    console.log('| kecamatan       => ', kecamatan);
    console.log('| kelurahan       => ', kelurahan);
    console.log('| kodePos         => ', kodePos);
    console.log('| kewarganegaraan => ', kewarganegaraan);
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
                + ' tu1.kewarganegaraan = ' + formatString(kewarganegaraan) + ','
                + ' tu1.updated_at = \'' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\','
                + ' tu1.updated_by = tu2.user_id ' +
                ' WHERE tu1.user_code = ' + formatEmail(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateAlamatInvestorCorporate = function (userCode, alamat, provinsi, kota, kodePos) {

    let connectionContext;

    console.log('|================ UPDATE DATA ALAMAT INVESTOR CORPORATE =================|');
    console.log('| usercode               => ', userCode);
    console.log('| alamatCompany          => ', alamat);
    console.log('| provinsiCompany        => ', provinsi);
    console.log('| kotaCompany            => ', kota);
    console.log('| kodePosCompany         => ', kodePos);
    console.log('|============================== END OF DATA =============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_perusahaan tp, (SELECT user_id FROM tbl_users WHERE user_code = ' + formatEmail(userCode) + ') AS tu '
                + 'SET'
                + ' tp.alamat = ' + formatString(alamat) + ','
                + ' tp.provinsi = ' + formatString(provinsi) + ','
                + ' tp.kota = ' + formatString(kota) + ','
                + ' tp.kode_pos = ' + formatString(kodePos) + ','
                + ' tp.updated_at = \'' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\','
                + ' tp.updated_by = tu.user_id ' +
                ' WHERE tp.user_id = tu.user_id;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateDataDiriInvestorPersonal = function (userCode, panggilan, nama, tempatLahir, tanggalLahir, jenisKelamin, agama, pekerjaan, statusPerkawinan, penghasilan, pendidikan, sumberDana, namaGadisIbu, alamat, provinsi, kabupaten, kecamatan, kelurahan, kodePos, kewarganegaraan, noNPWP, noKTP, tempatTerbit, tanggalKadaluarsa, noKitas, noPassport) {

    let connectionContext;

    console.log('');
    console.log('|================== UPDATE DATA DIRI INVESTOR PERSONAL ==================|');
    console.log('| usercode               => ', userCode);
    console.log('| panggilan              => ', panggilan);
    console.log('| nama                   => ', nama);
    console.log('| tempatLahir            => ', tempatLahir);
    console.log('| tanggalLahir           => ', tanggalLahir);
    console.log('| jenisKelamin           => ', jenisKelamin);
    console.log('| agama                  => ', agama);
    console.log('| pekerjaan              => ', pekerjaan);
    console.log('| statusPerkawinan       => ', statusPerkawinan);
    console.log('| penghasilan            => ', penghasilan);
    console.log('| pendidikan             => ', pendidikan);
    console.log('| sumberDana             => ', sumberDana);
    console.log('| namaGadisIbu           => ', namaGadisIbu);
    console.log('| alamat                 => ', alamat);
    console.log('| provinsi               => ', provinsi);
    console.log('| kabupaten              => ', kabupaten);
    console.log('| kecamatan              => ', kecamatan);
    console.log('| kelurahan              => ', kelurahan);
    console.log('| kodePos                => ', kodePos);
    console.log('| kewarganegaraan        => ', kewarganegaraan);
    console.log('| noNPWP                 => ', noNPWP);
    console.log('| noKTP                  => ', noKTP);
    console.log('| tempatTerbit           => ', tempatTerbit);
    console.log('| tanggalKadaluarsa      => ', tanggalKadaluarsa);
    console.log('| noKitas                => ', noKitas);
    console.log('| noPassport             => ', noPassport);
    console.log('|============================== END OF DATA =============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_users tu, (SELECT user_id FROM tbl_users WHERE user_code = ' + formatEmail(userCode) + ') AS tuc '
                + 'SET'
                + ' tu.titel = ' + formatString(panggilan) + ','
                + ' tu.nama = ' + formatString(nama) + ','
                + ' tu.tempat_lahir = ' + formatString(tempatLahir) + ','
                + ' tu.tanggal_lahir = ' + formatString(tanggalLahir) + ','
                + ' tu.jenis_kelamin = ' + formatString(jenisKelamin) + ','
                + ' tu.agama = ' + formatString(agama) + ','
                + ' tu.pekerjaan = ' + formatString(pekerjaan) + ','
                + ' tu.status_pernikahan = ' + formatString(statusPerkawinan) + ','
                + ' tu.pendapatan = ' + formatString(penghasilan) + ','
                + ' tu.pendidikan = ' + formatString(pendidikan) + ','
                + ' tu.sumber_dana = ' + formatString(sumberDana) + ','
                + ' tu.nama_gadis_ibu = ' + formatString(namaGadisIbu) + ','
                + ' tu.alamat = ' + formatString(alamat) + ','
                + ' tu.provinsi = ' + formatString(provinsi) + ','
                + ' tu.kabupaten = ' + formatString(kabupaten) + ','
                + ' tu.kecamatan = ' + formatString(kecamatan) + ','
                + ' tu.kelurahan = ' + formatString(kelurahan) + ','
                + ' tu.kode_pos = ' + formatString(kodePos) + ','
                + ' tu.kewarganegaraan = ' + formatString(kewarganegaraan) + ','
                + ' tu.no_npwp = ' + formatString(noNPWP) + ','
                + ' tu.no_ktp = ' + formatString(noKTP) + ','
                + ' tu.kota_terbit = ' + formatString(tempatTerbit) + ','
                + ' tu.tanggal_kadaluarsa = ' + formatString(tanggalKadaluarsa) + ','
                + ' tu.no_kitas = ' + formatString(noKitas) + ','
                + ' tu.no_passport = ' + formatString(noPassport) + ','
                + ' tu.updated_at = \'' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\','
                + ' tu.updated_by = tuc.user_id ' +
                ' WHERE tu.user_id = tuc.user_id;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateDataDiriInvestorCorporate = function (userCode, nama, noKTP) {

    let connectionContext;

    console.log('');
    console.log('|================== UPDATE DATA DIRI INVESTOR PERSONAL ==================|');
    console.log('| usercode               => ', userCode);
    console.log('| nama                   => ', nama);
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
                + ' tu.no_ktp = ' + formatString(noKTP) + ','
                + ' tu.updated_at = \'' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\','
                + ' tu.updated_by = tuc.user_id ' +
                ' WHERE tu.user_id = tuc.user_id;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateDataPerusahaanInvestorCorporate = function (userCode, perusahaanNama, perusahaanEmail, perusahaanTelepon, tempatBerdiri, tanggalBerdiri, alamat, provinsi, kota, kodePos) {

    let connectionContext;

    console.log('');
    console.log('|=============== UPDATE DATA PERUSAHAAN INVESTOR CORPORATE ==============|');
    console.log('| usercode                 => ', userCode);
    console.log('| perusahaan_nama          => ', perusahaanNama);
    console.log('| perusahaan_email         => ', perusahaanEmail);
    console.log('| perusahaan_telepon       => ', perusahaanTelepon);
    console.log('| tempat_berdiri           => ', tempatBerdiri);
    console.log('| tanggal_berdiri          => ', tanggalBerdiri);
    console.log('| alamat                   => ', alamat);
    console.log('| provinsi                 => ', provinsi);
    console.log('| kota                     => ', kota);
    console.log('| kode_pos                 => ', kodePos);
    console.log('|============================== END OF DATA =============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'UPDATE tbl_perusahaan tp, (SELECT user_id FROM tbl_users WHERE user_code = ' + formatEmail(userCode) + ') AS tuc '
                + 'SET'
                + ' tp.perusahaan_nama = ' + formatString(perusahaanNama) + ','
                + ' tp.perusahaan_email = ' + formatString(perusahaanEmail) + ','
                + ' tp.perusahaan_telepon = ' + formatString(perusahaanTelepon) + ','
                + ' tp.tempat_berdiri = ' + formatString(tempatBerdiri) + ','
                + ' tp.tanggal_berdiri = ' + formatString(tanggalBerdiri) + ','
                + ' tp.alamat = ' + formatString(alamat) + ','
                + ' tp.provinsi = ' + formatString(provinsi) + ','
                + ' tp.kota = ' + formatString(kota) + ','
                + ' tp.kode_pos = ' + formatString(kodePos) + ','
                + ' tp.updated_at = \'' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\','
                + ' tp.updated_by = tuc.user_id ' +
                ' WHERE tp.user_id = tuc.user_id;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateDataAuthInvestor = function (userCode, email, nomorTelepon) {

    let connectionContext;

    console.log('');
    console.log('|======================= UPDATE DATA AUTH INVESTOR ======================|');
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

const updateDataBankInvestor = function (userCode, kodeBank, nomorRekening, namaNasabah, jenisRekening, cabang) {

    let connectionContext;

    console.log('');
    console.log('|================== UPDATE DATA BANK INVESTOR PERSONAL ==================|');
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

const deleteInvestor = function (userId) {

    let connectionContext;

    console.log('X============= DELETE INVESTOR ==============X');
    console.log('X userId => ', userId);
    console.log('X=============== END OF DATA ================X');

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

const rollbackInvestorDataPerusahaan = function (userId) {
    let connectionContext;
    console.log('X======== DELETE DATA PERUSAHAAN OF =========X');
    console.log('X userid => ', userId);
    console.log('X=============== END OF DATA ================X');
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

const rollbackInvestorDataBank = function (userId) {
    let connectionContext;
    console.log('X=========== DELETE DATA BANK OF ============X');
    console.log('X userid => ', userId);
    console.log('X=============== END OF DATA ================X');
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

const getAllTopUp = function (userCode) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' SUM(amount) as ' + formatString('amount') + ', MONTH(transaction_at) as ' + formatString('month') + ', YEAR(transaction_at) as ' + formatString('year') + ' '
                + 'FROM tbl_asset_txn '
                + 'WHERE user_code = ' + formatEmail(userCode) + ' '
                + 'GROUP BY YEAR(transaction_at), MONTH(transaction_at) ASC;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllWithdraw = function (userCode) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' SUM(amount) as ' + formatString('amount') + ', MONTH(transaction_at) as ' + formatString('month') + ', YEAR(transaction_at) as ' + formatString('year') + ' '
                + 'FROM tbl_withdraw_txn '
                + 'WHERE user_code = ' + formatEmail(userCode) + ' '
                + 'AND txn_type = 2 '
                + 'AND status = 1 '
                + 'GROUP BY YEAR(transaction_at), MONTH(transaction_at) ASC;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getTotalWithdraw = function (userCode) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' SUM(amount) as ' + formatString('amount') + ' '
                + 'FROM tbl_withdraw_txn '
                + 'WHERE user_code = ' + formatEmail(userCode) + ' '
                + 'AND txn_type = 2 '
                + 'AND status = 1;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllIncome = function (userCode) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' SUM(amount) as ' + formatString('amount') + ', MONTH(updated_date) as ' + formatString('month') + ', YEAR(updated_date) as ' + formatString('year') + ' '
                + 'FROM tbl_dividen '
                + 'WHERE user_code = ' + formatEmail(userCode) + ' '
                + 'GROUP BY YEAR(updated_date), MONTH(updated_date) ASC;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getTotalIncome = function (userCode) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' SUM(total_interest) as ' + formatString('amount') + ' '
                + 'FROM tbl_dividen '
                + 'WHERE user_code = ' + formatEmail(userCode) + ' '
                + 'AND status = 1;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getCountAllFundedLoan = function (userCode) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' COUNT(DISTINCT funding_id) as ' + formatString('funding') + ', MONTH(created_dt) as ' + formatString('month') + ', YEAR(created_dt) as ' + formatString('year') + ' '
                + 'FROM tbl_funding_detail '
                + 'WHERE user_code = ' + formatEmail(userCode) + ' '
                + 'GROUP BY YEAR(created_dt), MONTH(created_dt) ASC;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getTotalFundedLoan = function (userCode) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' COUNT(DISTINCT funding_id) as ' + formatString('funding') + ' '
                + 'FROM tbl_funding_detail '
                + 'WHERE user_code = ' + formatEmail(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailFundedLoan = function (userCode) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' tfd.user_code, tf.loan_code, tfd.funding, tfd.status, tfd.created_dt '
                + 'FROM tbl_funding_detail tfd '
                + 'JOIN tbl_funding tf '
                + 'ON tfd.funding_id = tf.id '
                + 'WHERE user_code = ' + formatEmail(userCode) + ' '
                + 'GROUP BY tfd.created_dt DESC;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailWithdraw = function (userCode) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' user_code, account_no, amount, bank_name, name, status, transaction_at '
                + 'FROM tbl_withdraw_txn '
                + 'WHERE user_code = ' + formatEmail(userCode) + ' '
                + 'AND txn_type = 2 '
                + 'GROUP BY transaction_at DESC;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailTopUp = function (userCode) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' user_code, virtual_acc, amount, bank_name, transaction_at '
                + 'FROM tbl_asset_txn '
                + 'WHERE user_code = ' + formatEmail(userCode) + ' '
                + 'GROUP BY transaction_at DESC;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailIncome = function (userCode) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' *'
                + 'FROM tbl_dividen '
                + 'WHERE user_code = ' + formatEmail(userCode) + ' '
                + 'AND status = 1 '
                + 'GROUP BY updated_date DESC;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    insertInvestorPersonal,
    insertInvestorCorporateUser,
    insertInvestorCorporatePerusahaan,
    insertInvestorBank,
    updateAlamatInvestorPersonal,
    updateAlamatInvestorCorporate,
    updateDataDiriInvestorPersonal,
    updateDataDiriInvestorCorporate,
    updateDataPerusahaanInvestorCorporate,
    updateDataAuthInvestor,
    updateDataBankInvestor,
    deleteInvestor,
    rollbackInvestorDataPerusahaan,
    rollbackInvestorDataBank,
    getAllTopUp,
    getDetailTopUp,
    getAllWithdraw,
    getTotalWithdraw,
    getDetailWithdraw,
    getAllIncome,
    getTotalIncome,
    getDetailIncome,
    getCountAllFundedLoan,
    getTotalFundedLoan,
    getDetailFundedLoan
};
