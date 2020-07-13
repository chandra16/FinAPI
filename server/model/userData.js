const Connect = require('../service/dbPool');

const formatLike = function (string) {
    return '\'' + string + '\%\'';
};

const formatString = function (string) {
    return '\'' + string + '\'';
};

const checkUserCode = function (usercode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' user_code '
                + 'FROM tbl_users '
                + 'WHERE user_code like ' + formatLike(usercode) + ' '
                + 'ORDER BY user_code desc;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getBorrowerBasedRole = function (roleid) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' tu.*,'
                + ' ta.*,'
                + ' tb.list_bank_id, tb.kode_bank, tb.nomor_rekening, tb.nama_nasabah, tb.jenis_rekening, tb.cabang, '
                + ' tec.nama as ' + formatString('nama_1') + ', tec.no_hp as ' + formatString('no_hp_1') + ', tec.hubungan as ' + formatString('hubungan_1') + ', tec.nama_2, tec.no_hp_2, tec.hubungan_2, tec.nama_3, tec.no_hp_3, tec.hubungan_3 '
                + 'FROM tbl_users tu '
                + 'LEFT JOIN tbl_authentications ta ON tu.auth_id = ta.authentication_id '
                + 'LEFT JOIN tbl_bank tb ON tu.bank_id = tb.bank_id '
                + 'LEFT JOIN tbl_emergency_contact tec ON tu.user_id = tec.users_id '
                + 'WHERE tu.role_id = ' + roleid + ' AND tu.deleted = 0' + ' '
                + 'GROUP BY tu.user_id;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getUserBasedRole = function (roleid) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT '
                + ' tu.*,'
                + ' ta.email, ta.code_country, ta.no_hp, ta.is_verify,'
                + ' tp.perusahaan_nama, tp.perusahaan_email, tp.perusahaan_telepon, tp.tempat_berdiri, tp.tanggal_berdiri, tp.alamat AS ' + formatString('perusahaan_alamat') + ', tp.provinsi AS ' + formatString('perusahaan_provinsi') + ', tp.kota AS ' + formatString('perusahaan_kota') + ', tp.kode_pos AS ' + formatString('perusahaan_kode_pos') + ','
                + ' tb.list_bank_id, tb.kode_bank, tb.nomor_rekening, tb.nama_nasabah, tb.jenis_rekening, tb.cabang,'
                + ' tmi.monthly_income_code,'
                + ' tms.marital_status_code '
                + 'FROM tbl_users tu '
                + 'LEFT JOIN tbl_authentications ta ON tu.auth_id = ta.authentication_id '
                + 'LEFT JOIN tbl_bank tb ON tu.bank_id = tb.bank_id '
                + 'LEFT JOIN tbl_perusahaan tp ON tu.perusahaan_id = tp.perusahaan_id '
                + 'LEFT JOIN tbl_monthly_income tmi ON tu.pendapatan = tmi.monthly_income_id '
                + 'LEFT JOIN tbl_marital_status tms ON tu.status_pernikahan = tms.marital_status_id '
                + 'WHERE tu.role_id = ' + roleid + ' AND tu.deleted = 0' + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllNewUser = (roleId, status) => {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' user_code, nama, no_ktp, no_npwp, jenis_kelamin, tempat_lahir, tanggal_lahir '
                + 'FROM tbl_users '
                + 'WHERE role_id = ' + roleId + ' '
                + 'AND approval = ' + status + ' '
                + 'AND is_register = 1 '
                + 'AND deleted = 0;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getReferalCode = (referalCode) => {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' referal_code '
                + 'FROM tbl_users '
                + 'WHERE referal_code = ' + formatString(referalCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getReferalCodeUser = (userCode) => {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' referal_code '
                + 'FROM tbl_users '
                + 'WHERE user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const approveUser = (userCode, roleId, admin, status, referalCode) => {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_users '
                + 'SET'
                + ' referal_code = ' + formatString(referalCode) + ' ,'
                + ' approval = ' + status + ' ,'
                + ' approval_by = ' + formatString(admin) + ' ,'
                + ' approval_at = ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ' '
                + 'WHERE user_code = ' + formatString(userCode) + ' '
                + 'AND role_id = ' + roleId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const checkApprovalStatus = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT approval FROM tbl_users where user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailUser = (authId) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' tu.user_code, tu.user_id,tu.role_id, tu.nama, tu.tanggal_lahir, tu.jenis_kelamin, tu.alamat, tu.provinsi, tu.kabupaten, tu.kecamatan, tu.kelurahan, tu.kode_pos, tu.no_ktp, tu.no_npwp, tu.kewarganegaraan, tu.approval, tu.create_at,'
                + ' ta.no_hp, ta.email, ta.code_country '
                + 'FROM tbl_authentications ta '
                + 'JOIN tbl_users tu '
                + 'ON ta.authentication_id = tu.auth_id '
                + 'WHERE ta.authentication_id = ' + authId + ' '
                + 'ORDER BY ta.authentication_id desc;'
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateProfile = (userId, alamat, kewarganegaraan, provinsi, kabupaten, kecamatan, kelurahan, kodePost) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_users '
                + 'SET'
                + ' alamat = ' + formatString(alamat) + ','
                + ' kewarganegaraan = ' + formatString(kewarganegaraan) + ','
                + ' provinsi = ' + formatString(provinsi) + ','
                + ' kabupaten = ' + formatString(kabupaten) + ','
                + ' kecamatan = ' + formatString(kecamatan) + ','
                + ' kelurahan = ' + formatString(kelurahan) + ','
                + ' kode_pos = ' + formatString(kodePost) + ' '
                + 'WHERE user_id = ' + userId + ';'
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const logout = (userCode) => {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_users '
                + 'SET'
                + ' last_login = ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ' '
                + 'WHERE user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailUserByUserCode = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT '
                + 'user_code, user_id, authentication_id, tipe_id, nama, tanggal_lahir, tempat_lahir, jenis_kelamin, alamat, provinsi, kabupaten, kecamatan, kelurahan, kode_pos, no_ktp, no_npwp, kewarganegaraan, email, code_country, no_hp, pendidikan, pekerjaan, sektor_pekerjaan, agama, upload_ktp, upload_selfie, upload_npwp, create_at '
                + 'FROM tbl_authentications '
                + 'JOIN tbl_users '
                + 'ON tbl_authentications.authentication_id = tbl_users.auth_id '
                + 'WHERE user_code = ' + formatString(userCode) + ' '
                + 'ORDER BY authentication_id desc;'
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailInvestorByUserCode = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' tu.user_code, tu.tipe_id, tu.perusahaan_id, tu.titel, tu.nama, tu.tanggal_lahir, tu.tempat_lahir, tu.jenis_kelamin, tu.alamat, tu.provinsi, tu.kabupaten, tu.kecamatan, tu.kelurahan, tu.kode_pos, tu.no_ktp, tu.no_npwp, tu.kewarganegaraan, tu.nama_gadis_ibu, tu.status_pernikahan, tu.agama, tu.pendidikan, tu.pekerjaan, tu.sektor_pekerjaan, tu.deskripsi_pekerjaan, tu.lama_bekerja, tu.pendapatan, tu.sumber_dana, tu.kota_terbit, tu.tanggal_kadaluarsa,'
                + ' ta.email, ta.code_country, ta.no_hp, tu.upload_ktp, tu.upload_selfie,'
                + ' tp.perusahaan_nama, tp.perusahaan_email, tp.perusahaan_telepon, tp.tempat_berdiri, tp.tanggal_berdiri,'
                + ' tp.alamat AS ' + formatString('perusahaan_alamat') + ', tp.provinsi AS ' + formatString('perusahaan_provinsi') + ', tp.kota AS ' + formatString('perusahaan_kota') + ', tp.kode_pos AS ' + formatString('perusahaan_kode_pos') + ','
                + ' tb.list_bank_id, tb.kode_bank, tb.nomor_rekening, tb.nama_nasabah, tb.jenis_rekening, tb.cabang '
                + 'FROM tbl_users tu '
                + 'LEFT JOIN tbl_perusahaan tp ON tu.perusahaan_id = tp.perusahaan_id '
                + 'LEFT JOIN tbl_authentications ta ON tu.auth_id = ta.authentication_id '
                + 'LEFT JOIN tbl_bank tb ON tu.bank_id = tb.bank_id '
                + 'WHERE tu.user_code = ' + formatString(userCode) + ' '
                + 'ORDER BY ta.authentication_id desc;'
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailBorrowerByUserCode = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' tu.user_code, tu.nama, tu.tanggal_lahir, tu.tempat_lahir, tu.jenis_kelamin, tu.pendidikan, tu.status_pernikahan, tu.alamat, tu.provinsi, tu.kabupaten, tu.kecamatan, tu.kelurahan, tu.kode_pos, tu.no_ktp, tu.no_npwp,'
                + ' tu.pekerjaan, tu.sektor_pekerjaan, tu.deskripsi_pekerjaan, tu.lama_bekerja, tu.pendapatan, tu.kewarganegaraan, tu.no_kitas, tu.no_passport,'
                + ' ta.email, ta.code_country, ta.no_hp, tu.upload_ktp, tu.upload_selfie,'
                + ' tec.nama as ' + formatString('nama_1') + ', tec.no_hp as ' + formatString('no_hp_1') + ', tec.hubungan as ' + formatString('hubungan_1') + ', tec.nama_2, tec.no_hp_2, tec.hubungan_2, tec.nama_3, tec.no_hp_3, tec.hubungan_3,'
                + ' tb.list_bank_id, tb.kode_bank, tb.nomor_rekening, tb.nama_nasabah, tb.jenis_rekening, tb.cabang '
                + 'FROM tbl_users tu '
                + 'LEFT JOIN tbl_authentications ta ON tu.auth_id = ta.authentication_id '
                + 'LEFT JOIN tbl_emergency_contact tec ON tu.user_id = tec.users_id '
                + 'LEFT JOIN tbl_bank tb ON tu.bank_id = tb.bank_id '
                + 'WHERE tu.user_code = ' + formatString(userCode) + ' '
                + 'ORDER BY ta.authentication_id desc;'
            );
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const getDetailBankByUserCode = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' u.user_code, u.user_id, u.nama, u.approval,'
                + ' b.kode_bank, b.nama_nasabah, b.nomor_rekening, b.cabang, b.jenis_rekening,'
                + ' l.nama_bank, l.pg_code '
                + 'FROM tbl_users u '
                + 'LEFT JOIN tbl_bank b ON u.user_id = b.user_id '
                + 'LEFT JOIN tbl_list_bank l ON l.kode_bank = b.kode_bank '
                + 'WHERE u.user_code = ' + formatString(userCode) + ' ;'
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAccountBankDetailByUserCode = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const query = ''
                + 'SELECT '
                + 'u.user_code, u.user_id, u.nama, b.kode_bank, b.nomor_rekening, l.nama_bank, l.pg_code '
                + 'from tbl_users u  '
                + 'left join tbl_bank b on u.user_id = b.user_id '
                + 'left join tbl_list_bank l on l.kode_bank = b.kode_bank '
                + 'WHERE u.user_code = ' + formatString(userCode);
            process.stdout.write('getAccountBankDetailByUserCode::userCode' + query + '\n');
            return connection.query(query);
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const checkDeleteStatus = (email) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT user.deleted '
                + 'FROM tbl_users user, tbl_authentications auth WHERE auth.authentication_id = user.auth_id AND auth.email=' + formatString(email) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getEmailByUserCode = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT '
                + 'email '
                + 'FROM tbl_authentications '
                + 'JOIN tbl_users '
                + 'ON tbl_authentications.authentication_id = tbl_users.auth_id '
                + 'WHERE user_code = ' + formatString(userCode) + ' '
                + ';'
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    approveUser,
    checkApprovalStatus,
    checkDeleteStatus,
    checkUserCode,
    getAllNewUser,
    getBorrowerBasedRole,
    getUserBasedRole,
    logout,
    updateProfile,
    getDetailUser,
    getDetailUserByUserCode,
    getDetailInvestorByUserCode,
    getDetailBorrowerByUserCode,
    getAccountBankDetailByUserCode,
    getDetailBankByUserCode,
    getEmailByUserCode,
    getReferalCode,
    getReferalCodeUser
};
