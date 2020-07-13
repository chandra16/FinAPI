const Connect = require('../service/dbPool');
const Moment = require('moment');

const formatString = function (string) {
    return '\'' + string + '\'';
};

const formatEmail = function (string) {
    return '\'' + string + '\'';
};

const getAllReportAging = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' nm_cabang, nm_kolektor, nm_marketing, nm_dealer, nm_channel, no_kontrak, referensi, nm_customer, cara_bayar, tenor, adv_arr, tgl_jt_tempo, angsuran_ke, angsuran, hari, alamat, kelurahan, kecamatan, kat, telepon, no_rangka, no_mesin, no_polisi, no_bpkb, tahun, merk, tipe, status, kw_tunggak, tgl_kontrak, os_pokok, od_status '
                + 'FROM tbl_aging;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllReportProfilIndividu = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' tgl_record, id_penyelenggara, id_pengguna, nama_pengguna, jenis_pengguna_id, id_badan_hukum, jenis_badan_hukum, nama_badan_hukum, id_ktp, tempat_lahir, tanggal_lahir, usia, jenis_kelamin, pendidikan_id, pekerjaan_id, bidang_pekerjaan, kode_penyelenggara, jasa_layanan_keuangan_id, domisili_penyelenggara, agama_id, alamat, kota, provinsi '
                + 'FROM tbl_profil_individu;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllReportProfilIPinjaman = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' tgl_permohonan_pinjaman, jml_permohonan_pinjaman, rating_permohonan_pinjaman, informasi_kredit, jml_permohonan_pinjaman_disetujui, tgl_penawaran_pemberian_pinjaman, jml_penawaran_pemberian_pinjaman, permintaan_jaminan, jml_penawaran_pemberian_pinjaman_disetujui, penggunaan_pinjaman, frekuensi_pembayaran, jenis_pembayaran, tingkat_bunga_pinjaman, tgl_jatuh_tempo_pinjaman, tenor_pinjaman, sisa_pinjaman_berjalan, status_pinjaman '
                + 'FROM tbl_profil_pinjaman;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDataForm3C = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT  individu.tgl_record, individu.id_penyelenggara, individu.id_pengguna,'
                + ' individu.nama_pengguna, individu.jenis_pengguna_id, individu.id_badan_hukum,'
                + ' individu.jenis_badan_hukum, individu.nama_badan_hukum, individu.id_ktp, individu.tempat_lahir,'
                + ' individu.tanggal_lahir, individu.usia, individu.jenis_kelamin, individu.pendidikan_id,'
                + ' individu.pekerjaan_id, individu.bidang_pekerjaan, individu.kode_penyelenggara, individu.jasa_layanan_keuangan_id,'
                + ' individu.domisili_penyelenggara, individu.agama_id, individu.alamat, individu.kota, individu.provinsi,'
                + ' pinjaman.tgl_permohonan_pinjaman, pinjaman.jml_permohonan_pinjaman, pinjaman.rating_permohonan_pinjaman,'
                + ' pinjaman.informasi_kredit, pinjaman.jml_permohonan_pinjaman_disetujui, pinjaman.tgl_penawaran_pemberian_pinjaman,'
                + ' pinjaman.jml_penawaran_pemberian_pinjaman, pinjaman.permintaan_jaminan, pinjaman.jml_penawaran_pemberian_pinjaman_disetujui,'
                + ' pinjaman.penggunaan_pinjaman, pinjaman.frekuensi_pembayaran, pinjaman.jenis_pembayaran, pinjaman.tingkat_bunga_pinjaman,'
                + ' pinjaman.tgl_jatuh_tempo_pinjaman, pinjaman.tenor_pinjaman, pinjaman.sisa_pinjaman_berjalan, pinjaman.status_pinjaman'
                + ' FROM tbl_profil_pinjaman pinjaman RIGHT JOIN tbl_profil_individu individu ON pinjaman.user_code = individu.user_code;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllReportPermohonanPinjaman = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' month_id, province_region_id, jumlah_orang, jumlah_perusahaan, jumlah_uang, rata_rata_tertimbang_bunga, rata_rata_tertimbang_tenor '
                + 'FROM tbl_reporting_permohonan_peminjam;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllReportPersetujuanPinjaman = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' month_id, province_region_id, jumlah_orang, jumlah_perusahaan, jumlah_uang, rata_rata_tertimbang_bunga, rata_rata_tertimbang_tenor '
                + 'FROM tbl_reporting_persetujuan_peminjam;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllReportStatusPinjaman = function () {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' month_id, province_region_id, rata_rata_status_lancar, rata_rata_status_tidak_lancar, rata_rata_kredit_macet '
                + 'FROM tbl_reporting_status_pinjaman;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllReportStatusAkumulasiPinjaman = function () {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' month_id, province_region_id, jumlah_orang, jumlah_perusahaan, jumlah_uang, rata_rata_tertimbang_bunga, rata_rata_tertimbang_tenor, rata_rata_status_lancar, rata_rata_status_tidak_lancar, rata_rata_kredit_macet '
                + 'FROM tbl_reporting_status_akumulasi_pinjaman;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllRequestLoans = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
            + 'SELECT '
            + 'COUNT(loan_code) AS ' + formatString('total') + ' '
            + 'FROM tbl_request_loans '
            + 'WHERE status_approval = 3;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getListLoan = function (statusApproval) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' user_code, loan_code, id_loan_type, jumlah_pinjaman, lama_tenor, suku_bunga, grade, tujuan, admin_fee, created_at '
                + 'FROM tbl_request_loans '
                + 'WHERE status_approval = ' + statusApproval + '; ');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getListLoanReporting = function (statusApproval, year) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            return connection.query(''
                + 'SELECT'
                + ' user_code, loan_code, id_loan_type, jumlah_pinjaman, lama_tenor, suku_bunga, grade, tujuan, admin_fee, created_at '
                + 'FROM tbl_request_loans '
                + 'WHERE status_approval = ' + statusApproval + ' AND YEAR(approval_at) = ' + year + ' GROUP BY user_code;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getListUser = function (Approval) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' user_code, user_id, role_id, tipe_id, nama, tempat_lahir, tanggal_lahir, no_ktp, jenis_kelamin, pendidikan, pekerjaan, sektor_pekerjaan, agama, alamat, kabupaten, provinsi, create_at '
                + 'FROM tbl_users '
                + 'WHERE approval = ' + Approval + '; ');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getContractNumber = function (loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' document_no '
                + 'FROM tbl_document '
                + 'WHERE remark = ' + formatString(loanCode) + '; ');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailInstallment = function (loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' amount, amount_late_interest, plan, due_date, remaining_day '
                + 'FROM tbl_installment '
                + 'WHERE loan_code = ' + formatString(loanCode) + ' '
                + 'AND status = 0 '
                + 'GROUP BY id;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getCountUnpaidInstallment = function (loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT SUM(x.count) AS' + formatString('count') + ' '
                + 'FROM ('
                + ' SELECT COUNT(*) as ' + formatString('count')
                + ' FROM tbl_installment'
                + ' WHERE loan_code = ' + formatString(loanCode)
                + ' AND status = 0'
                + ' GROUP BY id'
                + ') x;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDateOfDisburse = function (userCode, loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' transaction_at '
                + 'FROM tbl_withdraw_txn '
                + 'WHERE user_code = ' + formatString(userCode) + ' '
                + 'AND description LIKE \'%' + loanCode + '%\';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getCollateralFileName = function (loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' name_collateral_file '
                + 'FROM tbl_collateral '
                + 'WHERE loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

// Select Data For Generate Reporting Year/Month
const getPermohonanPeminjam = function (month, year) {
    let connectionContext;
    return Connect()
    .then(function (connection) {
        connectionContext = connection;
        var whereClause;
        if(month) {
            whereClause = ' WHERE data.month_id = ' + month + ' AND data.year = ' + year;
        } else if(!month) {
            whereClause = ' WHERE data.year = ' + year;
        }

        return connection.query('SELECT data.year, month.nama_month, region.nama_region, data.jumlah_orang, data.jumlah_perusahaan, data.jumlah_uang, data.rata_rata_tertimbang_bunga, data.rata_rata_tertimbang_tenor'
        + ' From tbl_reporting_permohonan_peminjam data inner join  tbl_province_region region ON data.province_region_id = region.region_id inner join tbl_reporting_month month ON data.month_id = month.month_id '
        + whereClause + ';');
    })
    .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const getPersetujuanPeminjam = function (month, year) {
    let connectionContext;
    return Connect()
    .then(function (connection) {
        connectionContext = connection;
        var whereClause;
        if(month) {
            whereClause = ' WHERE data.month_id = ' + month + ' AND data.year = ' + year;
        } else if(!month) {
            whereClause = ' WHERE data.year = ' + year;
        }

        return connection.query('SELECT data.year, month.nama_month, region.nama_region, data.jumlah_orang, data.jumlah_perusahaan, data.jumlah_uang, data.rata_rata_tertimbang_bunga, data.rata_rata_tertimbang_tenor'
        + ' From tbl_reporting_persetujuan_peminjam data inner join  tbl_province_region region ON data.province_region_id = region.region_id inner join tbl_reporting_month month ON data.month_id = month.month_id '
        + whereClause + ';');
    })
    .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const getStatusAkumulasiPeminjam = function (month, year) {
    let connectionContext;
    return Connect()
    .then(function (connection) {
        connectionContext = connection;
        var whereClause;
        if(month) {
            whereClause = ' WHERE data.month_id = ' + month + ' AND data.year = ' + year;
        } else if(!month) {
            whereClause = ' WHERE data.year = ' + year;
        }

        return connection.query('SELECT data.year, month.nama_month, region.nama_region, data.jumlah_orang, data.jumlah_perusahaan, data.jumlah_uang, data.rata_rata_tertimbang_bunga, data.rata_rata_tertimbang_tenor,'
        + ' data.rata_rata_status_lancar, data.rata_rata_status_tidak_lancar, data.rata_rata_kredit_macet'
        + ' From tbl_reporting_status_akumulasi_pinjaman data inner join  tbl_province_region region ON data.province_region_id = region.region_id inner join tbl_reporting_month month ON data.month_id = month.month_id '
        + whereClause + ';');
    })
    .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const getStatusPeminjam = function (month, year) {
    let connectionContext;
    return Connect()
    .then(function (connection) {
        connectionContext = connection;
        var whereClause;
        if(month) {
            whereClause = ' WHERE data.month_id = ' + month + ' AND data.year = ' + year;
        } else if(!month) {
            whereClause = ' WHERE data.year = ' + year;
        }

        return connection.query('SELECT data.year, month.nama_month, region.nama_region, data.rata_rata_status_lancar, data.rata_rata_status_tidak_lancar, data.rata_rata_kredit_macet'
        + ' From tbl_reporting_status_pinjaman data inner join  tbl_province_region region ON data.province_region_id = region.region_id inner join tbl_reporting_month month ON data.month_id = month.month_id '
        + whereClause + ';');
    })
    .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

// DELETE REPORTING

const deleteAllReportingAging = function (userCode) {

    let connectionContext;

    // console.log('');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--- DELETING TABLE AGING => BY ' + userCode);
    // console.log('*--------------------------------------------------------------*');
    // console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'DELETE FROM tbl_aging WHERE id_reporting IS NOT NULL');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const deleteAllReportingIndividu = function (userCode) {

    let connectionContext;

    // console.log('');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--- DELETING TABLE AGING => BY ' + userCode);
    // console.log('*--------------------------------------------------------------*');
    // console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'DELETE FROM tbl_profil_individu WHERE profil_id IS NOT NULL');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const deleteAllReportingLoans = function (userCode) {

    let connectionContext;

    // console.log('');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--- DELETING TABLE AGING => BY ' + userCode);
    // console.log('*--------------------------------------------------------------*');
    // console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'DELETE FROM tbl_profil_pinjaman WHERE profil_pinjaman_id IS NOT NULL');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const deleteAllReportingPermohonanPinjaman = function (userCode) {

    let connectionContext;

    // console.log('');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--- DELETING TABLE AGING => BY ' + userCode);
    // console.log('*--------------------------------------------------------------*');
    // console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'DELETE FROM tbl_reporting_permohonan_peminjam WHERE permohonan_pinjaman_id IS NOT NULL');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const deleteAllReportingPersetujuanPinjaman = function (userCode) {

    let connectionContext;

    // console.log('');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--- DELETING TABLE AGING => BY ' + userCode);
    // console.log('*--------------------------------------------------------------*');
    // console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'DELETE FROM tbl_reporting_persetujuan_peminjam WHERE persetujuan_id IS NOT NULL');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const deleteAllReportingStatus = function (userCode) {

    let connectionContext;

    // console.log('');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--- DELETING TABLE Reporting Status Pinjaman => BY ' + userCode);
    // console.log('*--------------------------------------------------------------*');
    // console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'DELETE FROM tbl_reporting_status_pinjaman WHERE status_id IS NOT NULL');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const deleteAllReportingStatusAkumulasi = function (userCode) {

    let connectionContext;

    // console.log('');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--- DELETING TABLE Reporting Status Pinjaman => BY ' + userCode);
    // console.log('*--------------------------------------------------------------*');
    // console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'DELETE FROM tbl_reporting_status_akumulasi_pinjaman WHERE status_akumulasi_id IS NOT NULL');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

//INSERT REPORTING

const insertReportingAging = function (nmCabang, nmKolektor, nmMarketing, nmDealer, nmChannel, nokontrak, referensi, nama, carabayar, lamatenor, advarr, tgljatuhtempo, angsuranke, angsuran, hari, alamat, kelurahan, kecamatan, kat, telepon, norangka, nomesin, nopolisi, nobpkb, tahun, merk, tipe, status, kwtunggak, tanggalkontrak, ospokok, odstatus, userCode) {

    let connectionContext;

    // console.log('');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--- Nama Cabang        => ', nmCabang);
    // console.log('*--- Nama Kolektor      => ', nmKolektor);
    // console.log('*--- Nama Marketing     => ', nmMarketing);
    // console.log('*--- Nama Dealer        => ', nmDealer);
    // console.log('*--- Nama Channel       => ', nmChannel);
    // console.log('*--- No Kontrak         => ', nokontrak);
    // console.log('*--- Referensi          => ', referensi);
    // console.log('*--- Nama               => ', nama);
    // console.log('*--- Cara Bayar         => ', carabayar);
    // console.log('*--- Lama Tenor         => ', lamatenor);
    // console.log('*--- ADV ARR            => ', advarr);
    // console.log('*--- Tgl_Jt_Tempo       => ', tgljatuhtempo);
    // console.log('*--- Angsuran Ke        => ', angsuranke);
    // console.log('*--- Angsuran           => ', angsuran);
    // console.log('*--- Hari               => ', hari);
    // console.log('*--- Alamat             => ', alamat);
    // console.log('*--- Kelurahan          => ', kelurahan);
    // console.log('*--- Kecamatan          => ', kecamatan);
    // console.log('*--- KAT                => ', kat);
    // console.log('*--- Telepon            => ', telepon);
    // console.log('*--- No_Rangka          => ', norangka);
    // console.log('*--- No_Mesin           => ', nomesin);
    // console.log('*--- No_Polisi          => ', nopolisi);
    // console.log('*--- No_BPKB            => ', nobpkb);
    // console.log('*--- Tahun              => ', tahun);
    // console.log('*--- Merk               => ', merk);
    // console.log('*--- Tipe               => ', tipe);
    // console.log('*--- Status             => ', status);
    // console.log('*--- Kw_Tunggak         => ', kwtunggak);
    // console.log('*--- Tgl_Kontrak        => ', tanggalkontrak);
    // console.log('*--- Os_Pokok           => ', ospokok);
    // console.log('*--- Od_Status          => ', odstatus);
    // console.log('*--- Created By         => ', userCode);
    // console.log('*--------------------------------------------------------------*');
    // console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_aging (nm_cabang, nm_kolektor, nm_marketing, nm_dealer, nm_channel, no_kontrak, referensi, nm_customer, cara_bayar, tenor, adv_arr, tgl_jt_tempo, angsuran_ke, angsuran, hari, alamat, kelurahan, kecamatan, kat, telepon, no_rangka, no_mesin, no_polisi, no_bpkb, tahun, merk, tipe, status, kw_tunggak, tgl_kontrak, os_pokok, od_status, create_by) '
                + 'VALUES ('
                + formatString(nmCabang) + ','
                + formatString(nmKolektor) + ','
                + formatString(nmMarketing) + ','
                + formatString(nmDealer) + ','
                + formatString(nmChannel) + ','
                + formatString(nokontrak) + ','
                + formatString(referensi) + ','
                + formatString(nama) + ','
                + formatString(carabayar) + ','
                + formatString(lamatenor) + ','
                + formatString(advarr) + ','
                + formatString(tgljatuhtempo) + ','
                + angsuranke + ','
                + angsuran + ','
                + hari + ','
                + formatString(alamat) + ','
                + formatString(kelurahan) + ','
                + formatString(kecamatan) + ','
                + formatString(kat) + ','
                + formatString(telepon) + ','
                + formatString(norangka) + ','
                + formatString(nomesin) + ','
                + formatString(nopolisi) + ','
                + formatString(nobpkb) + ','
                + formatString(tahun) + ','
                + formatString(merk) + ','
                + formatString(tipe) + ','
                + formatString(status) + ','
                + formatString(kwtunggak) + ','
                + formatString(tanggalkontrak) + ','
                + formatString(ospokok) + ','
                + formatString(odstatus) + ','
                + formatString(userCode) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertProfilIndividu = function (userCode, tanggalRecord, idPenyelenggara, idPengguna, namaPengguna, jenisPengguna, idBadanHukum, jenisBadanHukum, namaBadanHukum, idKtp, tempatLahir, tanggalLahir, usia, jenisKelamin, pendidikan, pekerjaan, bidangPekerjaan, kodePenyelenggara, jasaLayananKeuangan, domisiliPenyelenggara, agama, alamat, kota, provinsi) {

    let connectionContext;

    // console.log('');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--- Tgl Record             => ', tanggalRecord);
    // console.log('*--- ID Penyelenggara       => ', idPenyelenggara);
    // console.log('*--- ID Pengguna            => ', idPengguna);
    // console.log('*--- Nama Pengguna          => ', namaPengguna);
    // console.log('*--- Jenis Pengguna         => ', jenisPengguna);
    // console.log('*--- ID Badan Hukum         => ', idBadanHukum);
    // console.log('*--- Jenis Badan Hukum      => ', jenisBadanHukum);
    // console.log('*--- Nama Badan Hukum       => ', namaBadanHukum);
    // console.log('*--- ID KTP                 => ', idKtp);
    // console.log('*--- Tempat Lahir           => ', tempatLahir);
    // console.log('*--- Tanggal Lahir          => ', tanggalLahir);
    // console.log('*--- Usia                   => ', usia);
    // console.log('*--- Jenis Kelamin          => ', jenisKelamin);
    // console.log('*--- Pendidikan             => ', pendidikan);
    // console.log('*--- Pekerjaan              => ', pekerjaan);
    // console.log('*--- Bidang Pekerjaan       => ', bidangPekerjaan);
    // console.log('*--- Kode Penyelenggara     => ', kodePenyelenggara);
    // console.log('*--- Jasa Layanan Keuangan  => ', jasaLayananKeuangan);
    // console.log('*--- Domisili Penyelenggara => ', domisiliPenyelenggara);
    // console.log('*--- Agama                  => ', agama);
    // console.log('*--- Alamat                 => ', alamat);
    // console.log('*--- Kota                   => ', kota);
    // console.log('*--- Provinsi               => ', provinsi);
    // console.log('*--------------------------------------------------------------*');
    // console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_profil_individu (user_code, tgl_record, id_penyelenggara, id_pengguna, nama_pengguna, jenis_pengguna_id, id_badan_hukum, jenis_badan_hukum, nama_badan_hukum, id_ktp, tempat_lahir, tanggal_lahir, usia, jenis_kelamin, pendidikan_id, pekerjaan_id, bidang_pekerjaan, kode_penyelenggara, jasa_layanan_keuangan_id, domisili_penyelenggara, agama_id, alamat, kota, provinsi) '
                + 'VALUES ('
                + formatString(userCode) + ','
                + formatString(tanggalRecord) + ','
                + formatString(idPenyelenggara) + ','
                + formatString(idPengguna) + ','
                + formatString(namaPengguna) + ','
                + formatString(jenisPengguna) + ','
                + formatString(idBadanHukum) + ','
                + formatString(jenisBadanHukum) + ','
                + formatString(namaBadanHukum) + ','
                + formatString(idKtp) + ','
                + formatString(tempatLahir) + ','
                + formatString(tanggalLahir) + ','
                + usia + ','
                + formatString(jenisKelamin) + ','
                + formatString(pendidikan) + ','
                + formatString(pekerjaan) + ','
                + formatString(bidangPekerjaan) + ','
                + formatString(kodePenyelenggara) + ','
                + formatString(jasaLayananKeuangan) + ','
                + formatString(domisiliPenyelenggara) + ','
                + formatString(agama) + ','
                + formatString(alamat) + ','
                + formatString(kota) + ','
                + formatString(provinsi) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertProfilPinjaman = function (
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
    frekuensiBayaran,
    jenisBayaran,
    tingkatBungaPinjaman,
    tglJatuhTempoPinjaman,
    tenorPinjaman,
    sisaPinjamanBerjalan,
    statusPinjaman) {
    let connectionContext;

    // console.log('*--------------------------------------------------------------*');
    // console.log('*--- Tgl Permohonan Pinjaman           => ', tglPermohonanPinjaman);
    // console.log('*--- Jml Permohonan Pinjaman           => ', jmlPermohonanPinjaman);
    // console.log('*--- Rating Permohonan Pinjaman        => ', ratingPermohonanPinjaman);
    // console.log('*--- Informasi Kredit                  => ', informasiKredit);
    // console.log('*--- Jml Permohonan Pinjaman Disetujui => ', jmlPermohonanPinjamanDisetujui);
    // console.log('*--- Tgl Penawaran Pemberian Pinjaman  => ', tglPenawaranPemberianPinjaman);
    // console.log('*--- Permintaan Jaminan                => ', permintaanJaminan);
    // console.log('*--- Jml Penawaran Pemberian Pinjaman  => ', jmlPenawaranPemberianPinjaman);
    // console.log('*--- Penggunaan Pinjaman               => ', penggunaanPinjaman);
    // console.log('*--- Frekuensi Pembayaran              => ', frekuensiBayaran);
    // console.log('*--- Jenis Pembayaran                  => ', jenisBayaran);
    // console.log('*--- Tingkat Bunga Pinjaman            => ', tingkatBungaPinjaman);
    // console.log('*--- Tgl Jatuh Tempo Pinjaman          => ', tglJatuhTempoPinjaman);
    // console.log('*--- Tenor Pinjaman                    => ', tenorPinjaman);
    // console.log('*--- Sisa Pinjaman Berjalan            => ', sisaPinjamanBerjalan);
    // console.log('*--- Status Pinjaman                   => ', statusPinjaman);
    // console.log('*--------------------------------------------------------------*');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_profil_pinjaman (user_code, tgl_permohonan_pinjaman, jml_permohonan_pinjaman, rating_permohonan_pinjaman, informasi_kredit, jml_permohonan_pinjaman_disetujui, tgl_penawaran_pemberian_pinjaman, permintaan_jaminan, jml_penawaran_pemberian_pinjaman_disetujui, penggunaan_pinjaman, frekuensi_pembayaran, jenis_pembayaran, tingkat_bunga_pinjaman, tgl_jatuh_tempo_pinjaman, tenor_pinjaman, sisa_pinjaman_berjalan, status_pinjaman) '
                + 'VALUES ('
                + formatString(userCode) + ','
                + formatString(tglPermohonanPinjaman) + ','
                + formatString(jmlPermohonanPinjaman) + ','
                + formatString(ratingPermohonanPinjaman) + ','
                + formatString(informasiKredit) + ','
                + formatString(jmlPermohonanPinjamanDisetujui) + ','
                + formatString(tglPenawaranPemberianPinjaman) + ','
                + formatString(permintaanJaminan) + ','
                + formatString(jmlPenawaranPemberianPinjaman) + ','
                + formatString(penggunaanPinjaman) + ','
                + formatString(frekuensiBayaran) + ','
                + formatString(jenisBayaran) + ','
                + formatString(tingkatBungaPinjaman) + ','
                + formatString(tglJatuhTempoPinjaman) + ','
                + formatString(tenorPinjaman) + ','
                + formatString(sisaPinjamanBerjalan) + ','
                + formatString(statusPinjaman) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertPermohonanPinjaman = function (
    bulan,
    provinsi,
    jumlahOrang,
    jumlahPerusahaan,
    jumlahUang,
    rataRataTertimbangBunga,
    rataRataTertimbangTenor) {
    let connectionContext;

    // console.log('');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--- Bulan                          => ', bulan);
    // console.log('*--- Provinsi                       => ', provinsi);
    // console.log('*--- Jumlah Orang                   => ', jumlahOrang);
    // console.log('*--- Jumlah perusahaan              => ', jumlahPerusahaan);
    // console.log('*--- Jumlah uang (Rp Juta)          => ', jumlahUang);
    // console.log('*--- Rata-rata tertimbang bunga (%) => ', rataRataTertimbangBunga);
    // console.log('*--- Rata-rata tertimbang tenor (%) => ', rataRataTertimbangTenor);
    // console.log('*--------------------------------------------------------------*');
    // console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            return connection.query('INSERT INTO tbl_reporting_permohonan_peminjam (month_id, year, province_region_id, jumlah_orang, jumlah_perusahaan, jumlah_uang, rata_rata_tertimbang_bunga, rata_rata_tertimbang_tenor) '
                + 'VALUES ('
                + formatString(bulan) + ','
                + date.year() + ','
                + formatString(provinsi) + ','
                + formatString(jumlahOrang) + ','
                + formatString(jumlahPerusahaan) + ','
                + formatString(jumlahUang) + ','
                + formatString(rataRataTertimbangBunga) + ','
                + formatString(rataRataTertimbangTenor) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertPersetujuanPinjaman = function (
    bulan,
    provinsi,
    jumlahOrang,
    jumlahPerusahaan,
    jumlahUang,
    rataRataTertimbangBunga,
    rataRataTertimbangTenor) {
    let connectionContext;

    // console.log('');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--- Bulan                          => ', bulan);
    // console.log('*--- Provinsi                       => ', provinsi);
    // console.log('*--- Jumlah Orang                   => ', jumlahOrang);
    // console.log('*--- Jumlah perusahaan              => ', jumlahPerusahaan);
    // console.log('*--- Jumlah uang (Rp Juta)          => ', jumlahUang);
    // console.log('*--- Rata-rata tertimbang bunga (%) => ', rataRataTertimbangBunga);
    // console.log('*--- Rata-rata tertimbang tenor (%) => ', rataRataTertimbangTenor);
    // console.log('*--------------------------------------------------------------*');
    // console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            return connection.query('INSERT INTO tbl_reporting_persetujuan_peminjam (month_id, year, province_region_id, jumlah_orang, jumlah_perusahaan, jumlah_uang, rata_rata_tertimbang_bunga, rata_rata_tertimbang_tenor) '
                + 'VALUES ('
                + formatString(bulan) + ','
                + date.year() + ','
                + formatString(provinsi) + ','
                + formatString(jumlahOrang) + ','
                + formatString(jumlahPerusahaan) + ','
                + formatString(jumlahUang) + ','
                + formatString(rataRataTertimbangBunga) + ','
                + formatString(rataRataTertimbangTenor) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertStatusLoans = function (
    bulan,
    province,
    rataStatusLancar,
    rataStatusTidakLancar,
    rataKreditMacet) {
    let connectionContext;

    // console.log('');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--- Bulan                          => ', bulan);
    // console.log('*--- Provinsi Region                => ', province);
    // console.log('*--- Rata-rata status lancar        => ', rataStatusLancar);
    // console.log('*--- Rata-rata status tidak lancar  => ', rataStatusLancar);
    // console.log('*--- Rata-rata kredit macet         => ', rataKreditMacet);
    // console.log('*--------------------------------------------------------------*');
    // console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            return connection.query('INSERT INTO tbl_reporting_status_pinjaman (month_id, year,  province_region_id, rata_rata_status_lancar, rata_rata_status_tidak_lancar, rata_rata_kredit_macet) '
                + 'VALUES ('
                + formatString(bulan) + ','
                + date.year() + ','
                + formatString(province) + ','
                + formatString(rataStatusLancar) + ','
                + formatString(rataStatusTidakLancar) + ','
                + formatString(rataKreditMacet) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertStatusAkumulasiLoans = function (
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
    let connectionContext;

    // console.log('');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--------------------------------------------------------------*');
    // console.log('*--- Bulan                          => ', bulan);
    // console.log('*--- Provinsi Region                => ', province);
    // console.log('*--- Jumlah Orang                   => ', jumlahOrang);
    // console.log('*--- Rata-rata status lancar        => ', rataStatusLancar);
    // console.log('*--- Rata-rata status tidak lancar  => ', rataStatusLancar);
    // console.log('*--- Rata-rata kredit macet         => ', rataKreditMacet);
    // console.log('*--------------------------------------------------------------*');
    // console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            return connection.query('INSERT INTO tbl_reporting_status_akumulasi_pinjaman (month_id, year,  province_region_id, jumlah_orang, jumlah_perusahaan, jumlah_uang, rata_rata_tertimbang_bunga, rata_rata_tertimbang_tenor, rata_rata_status_lancar, rata_rata_status_tidak_lancar, rata_rata_kredit_macet) '
                + 'VALUES ('
                + formatString(bulan) + ','
                + date.year() + ','
                + formatString(province) + ','
                + formatString(jumlahOrang) + ','
                + formatString(jumlahPerusahaan) + ','
                + formatString(jumlahUang) + ','
                + formatString(rataRataTertimbangBunga) + ','
                + formatString(rataRataTertimbangTenor) + ','
                + formatString(rataStatusLancar) + ','
                + formatString(rataStatusTidakLancar) + ','
                + formatString(rataKreditMacet) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

// GET DETAIL REPORTING

const getDetailUserByUserCode = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT '
                + 'tu.user_code, tu.tipe_id, tu.nama, tu.tanggal_lahir, tu.tempat_lahir, tu.jenis_kelamin, tu.alamat, tu.provinsi, tu.kabupaten, tu.kecamatan, tu.kelurahan, tu.kode_pos, tu.no_ktp, tu.no_npwp, tu.kewarganegaraan, tu.create_at, '
                + 'te.name_education AS ' + formatString('pendidikan') + ', '
                + 'tj.name_job AS ' + formatString('pekerjaan') + ', '
                + 'tjs.name_job_sector AS ' + formatString('sektor_pekerjaan') + ', '
                + 'tr.religion_description AS ' + formatString('agama') + ' '
                + 'FROM tbl_users tu '
                + 'LEFT JOIN tbl_education te ON tu.pendidikan = te.id_education '
                + 'LEFT JOIN tbl_job tj ON tu.pekerjaan = tj.id_job '
                + 'LEFT JOIN tbl_job_sector tjs ON tu.sektor_pekerjaan = tjs.id_job_sector '
                + 'LEFT JOIN tbl_religion tr ON tu.agama = tr.religion_code '
                + 'WHERE tu.user_code = ' + formatString(userCode) + ';'
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertPosisiKeuangan = function (bulan, aset, kewajiban, ekuitas, modalSektor) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            const month = date.month() + 1;
            return connection.query(
                'INSERT into tbl_posisi_keuangan(year, month_id, aset, kewajiban, ekuitas, modal_setor) '
                + 'VALUES(' + date.year() + ', ' + bulan + ', ' + formatString(aset) + ', ' + formatString(kewajiban)
                + ', ' + formatString(ekuitas) + ', ' + formatString(modalSektor) + ');'
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertLabaRugi = function (bulan, pendapatan, bahanOperasional, labaRugi) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            const month = date.month() + 1;
            return connection.query(
                'INSERT into tbl_laba_rugi(year, month_id, pendapatan, bahan_operasional, laba_rugi) '
                + 'VALUES(' + date.year() + ', ' + bulan + ', ' + formatString(pendapatan) + ', ' + formatString(bahanOperasional)
                + ', ' + formatString(labaRugi) + ');'
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getLabaRugi = function (year) {
    console.log('ini tahunnya' + year);
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'SELECT data.year, month.nama_month, data.pendapatan, data.bahan_operasional, data.laba_rugi'
                + ' From tbl_laba_rugi data inner join tbl_reporting_month month ON data.month_id = month.month_id '
                + 'Where data.year = ' + year + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getPosisiKeuangan = function (year) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(
                'SELECT data.year, month.nama_month, data.aset, data.kewajiban, data.ekuitas, data.modal_setor'
                + ' From tbl_posisi_keuangan data inner join tbl_reporting_month month ON data.month_id = month.month_id '
                + 'Where data.year = ' + year + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailPersonalPerMonth = function () {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            const month = date.month() + 1;
            return connection.query(''
                + 'SELECT SUM(total_user) AS ' + formatString('total') + ', '
                + 'province_region_id, MONTH, YEAR '
                + 'FROM (SELECT COUNT(tu.user_id) AS ' + formatString('total_user') + ', '
                + 'tp.province_region_id, MONTH(tu.create_at) AS ' + formatString('month') + ', '
                + 'YEAR(tu.create_at) AS ' + formatString('year') + ' '
                + 'FROM tbl_users tu '
                + 'JOIN tbl_province tp ON tu.provinsi = tp.province_id '
                + 'WHERE tu.role_id = 1 AND tu.tipe_id = 1 AND YEAR(tu.create_at) = ' + date.year()
                + ' AND MONTH(tu.create_at) = ' + month
                + ' GROUP BY tu.create_at) '
                + 'AS t '
                + 'GROUP BY MONTH; '
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results[0]);
        });
};

const getDetailPersonalPerMonthApproved = function () {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            const month = date.month() + 1;
            return connection.query(''
            + 'SELECT SUM(total_user) AS ' + formatString('total') + ', '
            + 'province_region_id, MONTH, YEAR '
            + 'FROM (SELECT COUNT(tu.user_id) AS ' + formatString('total_user') + ', '
            + 'tp.province_region_id, MONTH(tu.create_at) AS ' + formatString('month') + ', '
            + 'YEAR(tu.create_at) AS ' + formatString('year') + ' '
            + 'FROM tbl_users tu '
            + 'JOIN tbl_province tp ON tu.provinsi = tp.province_id '
            + 'WHERE tu.role_id = 1 AND tu.approval = 1 AND tu.tipe_id = 1 '
            + 'AND YEAR(tu.create_at) = ' + date.year() + ' AND MONTH(tu.create_at) = ' + month
            + ' GROUP BY tu.create_at) '
            + 'AS t '
            + 'GROUP BY MONTH; '
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results[0]);
        });
};

const getDetailCorporatePerMonth = function () {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            const month = date.month() + 1;
            return connection.query(''
                + 'SELECT '
                + 'SUM(total_user) AS ' + formatString('total') + ', '
                + 'province_region_id, MONTH, YEAR '
                + 'FROM (SELECT COUNT(tu.user_id) AS ' + formatString('total_user') + ', '
                + 'tp.province_region_id , MONTH(tu.create_at) AS ' + formatString('month') + ', '
                + 'YEAR(tu.create_at) AS ' + formatString('year') + ' '
                + 'FROM tbl_users tu '
                + 'JOIN tbl_perusahaan tpe ON tu.perusahaan_id = tpe.perusahaan_id '
                + 'JOIN tbl_province tp ON tpe.provinsi = tp.province_id '
                + 'WHERE tu.role_id = 1 AND tu.tipe_id = 2 AND YEAR(tu.create_at) = ' + date.year()
                + ' AND MONTH(tu.create_at) = ' + month
                + ' GROUP BY tu.create_at) '
                + 'AS t '
                + 'GROUP BY MONTH; '
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results[0]);
        });
};

const getDetailCorporatePerMonthApproved = function () {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            const month = date.month() + 1;
            return connection.query(''
                + 'SELECT '
                + 'SUM(total_user) AS ' + formatString('total') + ', '
                + 'province_region_id, MONTH, YEAR '
                + 'FROM (SELECT COUNT(tu.user_id) AS ' + formatString('total_user') + ', '
                + 'tp.province_region_id , MONTH(tu.create_at) AS ' + formatString('month') + ', '
                + 'YEAR(tu.create_at) AS ' + formatString('year') + ' '
                + 'FROM tbl_users tu '
                + 'JOIN tbl_perusahaan tpe ON tu.perusahaan_id = tpe.perusahaan_id '
                + 'JOIN tbl_province tp ON tpe.provinsi = tp.province_id '
                + 'WHERE tu.role_id = 1 AND tu.approval = 1 AND tu.tipe_id = 2 AND YEAR(tu.create_at) = ' + date.year()
                + ' AND MONTH(tu.create_at) = ' + month
                + ' GROUP BY tu.create_at) '
                + 'AS t '
                + 'GROUP BY MONTH; '
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results[0]);
        });
};

const getDetailMoneyPerMonth = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            const month = date.month() + 1;
            return connection.query(''
                + 'SELECT '
                + 'SUM(total_uang) AS ' + formatString('total') + ', '
                + 'province_region_id, MONTH, YEAR '
                + 'FROM (SELECT SUM(tl.jumlah_pinjaman) AS ' + formatString('total_uang') + ', '
                + 'tp.province_region_id , MONTH(tl.created_at) AS ' + formatString('month') + ', '
                + 'YEAR(tl.created_at) AS ' + formatString('year') + ' '
                + 'FROM tbl_request_loans tl '
                + 'JOIN tbl_users tu ON tu.user_code = tl.user_code '
                + 'JOIN tbl_province tp ON tu.provinsi = tp.province_id '
                + 'WHERE YEAR(tu.create_at) = ' + date.year() + ' AND MONTH(tu.create_at) = ' + month
                + ' GROUP BY tl.created_at) '
                + 'AS t '
                + 'GROUP BY MONTH ' + ';'
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results[0]);
        });
};

const getDetailMoneyPerMonthApproved = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            const month = date.month() + 1;
            return connection.query(''
                + 'SELECT '
                + 'SUM(total_uang) AS ' + formatString('total') + ', '
                + 'province_region_id, MONTH, YEAR '
                + 'FROM (SELECT SUM(tl.jumlah_pinjaman) AS ' + formatString('total_uang') + ', '
                + 'tp.province_region_id , MONTH(tl.created_at) AS ' + formatString('month') + ', '
                + 'YEAR(tl.created_at) AS ' + formatString('year') + ' '
                + 'FROM tbl_request_loans tl '
                + 'JOIN tbl_users tu ON tu.user_code = tl.user_code '
                + 'JOIN tbl_province tp ON tu.provinsi = tp.province_id '
                + 'WHERE tl.status_approval = 3 AND YEAR(tu.create_at) = ' + date.year() + ' AND MONTH(tu.create_at) = ' + month
                + ' GROUP BY tl.created_at) '
                + 'AS t '
                + 'GROUP BY MONTH ' + ';'
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results[0]);
        });
};

const getDetailrataBungaPerMonth = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            const month = date.month() + 1;
            return connection.query(''
            + 'SELECT '
            + 'SUM(total) AS ' + formatString('totalInterest') + ', '
            + 'province_region_id, MONTH, YEAR '
            + 'FROM (SELECT SUM(tli.total_interest) AS ' + formatString('total') + ', '
            + 'province_region_id, MONTH(trl.created_at) AS ' + formatString('month') + ', '
            + 'YEAR(trl.created_at) AS ' + formatString('year') + ' '
            + 'FROM tbl_request_loans trl '
            + 'JOIN tbl_loan_interest tli ON trl.loan_code = tli.loan_code '
            + 'JOIN tbl_users tu ON tu.user_code = trl.user_code '
            + 'JOIN tbl_province tp ON tu.provinsi = tp.province_id '
            + 'WHERE YEAR(tu.create_at) = ' + date.year() + ' AND MONTH(tu.create_at) = ' + month
            + ' GROUP BY trl.created_at) '
            + 'AS t '
            + 'GROUP BY MONTH; '
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results[0]);
        });
};

const getDetailrataBungaPerMonthApproved = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            const month = date.month() + 1;
            return connection.query(''
            + 'SELECT '
            + 'SUM(total) AS ' + formatString('totalInterest') + ', '
            + 'province_region_id, MONTH, YEAR '
            + 'FROM (SELECT SUM(tli.total_interest) AS ' + formatString('total') + ', '
            + 'province_region_id, MONTH(trl.created_at) AS ' + formatString('month') + ', '
            + 'YEAR(trl.created_at) AS ' + formatString('year') + ' '
            + 'FROM tbl_request_loans trl '
            + 'JOIN tbl_loan_interest tli ON trl.loan_code = tli.loan_code '
            + 'JOIN tbl_users tu ON tu.user_code = trl.user_code '
            + 'JOIN tbl_province tp ON tu.provinsi = tp.province_id '
            + 'WHERE trl.status_approval = 3 AND YEAR(tu.create_at) = ' + date.year() + ' AND MONTH(tu.create_at) = ' + month
            + ' GROUP BY trl.created_at) '
            + 'AS t '
            + 'GROUP BY MONTH; '
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results[0]);
        });
};

const getDetailrataTenorPerMonth = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            const month = date.month() + 1;
            return connection.query(''
            + 'SELECT '
            + 'SUM(total) AS ' + formatString('totalTenor') + ', '
            + 'province_region_id, MONTH, YEAR '
            + 'FROM (SELECT SUM(trl.lama_tenor) AS ' + formatString('total') + ', '
            + 'province_region_id, MONTH(trl.created_at) AS ' + formatString('month') + ', '
            + 'YEAR(trl.created_at) AS ' + formatString('year') + ' '
            + 'FROM tbl_request_loans trl '
            + 'JOIN tbl_users tu ON tu.user_code = trl.user_code '
            + 'JOIN tbl_province tp ON tu.provinsi = tp.province_id '
            + 'WHERE YEAR(tu.create_at) = ' + date.year() + ' AND MONTH(tu.create_at) = ' + month
            + ' GROUP BY trl.created_at) '
            + 'AS t '
            + 'GROUP BY MONTH; '
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results[0]);
        });
};

const getDetailrataTenorPerMonthApproved = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            const month = date.month() + 1;
            return connection.query(''
            + 'SELECT '
            + 'SUM(total) AS ' + formatString('totalTenor') + ', '
            + 'province_region_id, MONTH, YEAR '
            + 'FROM (SELECT SUM(trl.lama_tenor) AS ' + formatString('total') + ', '
            + 'province_region_id, MONTH(trl.created_at) AS ' + formatString('month') + ', '
            + 'YEAR(trl.created_at) AS ' + formatString('year') + ' '
            + 'FROM tbl_request_loans trl '
            + 'JOIN tbl_users tu ON tu.user_code = trl.user_code '
            + 'JOIN tbl_province tp ON tu.provinsi = tp.province_id '
            + 'WHERE trl.status_approval = 3 AND YEAR(tu.create_at) = ' + date.year() + ' AND MONTH(tu.create_at) = ' + month
            + ' GROUP BY trl.created_at) '
            + 'AS t '
            + 'GROUP BY MONTH; '
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results[0]);
        });
};

const getDetailrataLancarPerMonth = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            const month = date.month() + 1;
            return connection.query(''
            + 'SELECT '
            + 'SUM(rata) AS ' + formatString('rataLancar') + ', '
            + 'province_region_id, MONTH, YEAR '
            + 'FROM (SELECT SUM(trl.credibility) AS ' + formatString('rata') + ', '
            + 'province_region_id, MONTH(trl.created_at) AS ' + formatString('month') + ', '
            + 'YEAR(trl.created_at) AS ' + formatString('year') + ' '
            + 'FROM tbl_request_loans trl '
            + 'JOIN tbl_users tu ON tu.user_code = trl.user_code '
            + 'JOIN tbl_province tp ON tu.provinsi = tp.province_id '
            + 'WHERE trl.credibility = 0 AND trl.status_approval = 3 AND YEAR(trl.created_at) = ' + date.year() + ' AND MONTH(trl.created_at) = ' + month
            + ' GROUP BY trl.created_at) '
            + 'AS t '
            + 'GROUP BY MONTH; '
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results[0]);
        });
};

const getDetailrataTidakLancarPerMonth = function () {
    let connectionContext;
    const date = new Moment();
    const month = date.month() + 1;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
            + 'SELECT '
            + 'SUM(rata) AS ' + formatString('rataTidakLancar') + ', '
            + 'province_region_id, MONTH, YEAR '
            + 'FROM (SELECT SUM(trl.credibility) AS ' + formatString('rata') + ', '
            + 'province_region_id, MONTH(trl.created_at) AS ' + formatString('month') + ', '
            + 'YEAR(trl.created_at) AS ' + formatString('year') + ' '
            + 'FROM tbl_request_loans trl '
            + 'JOIN tbl_users tu ON tu.user_code = trl.user_code '
            + 'JOIN tbl_province tp ON tu.provinsi = tp.province_id '
            + 'WHERE trl.credibility = 2 AND trl.status_approval = 3 AND YEAR(trl.created_at) = ' + date.year() + ' AND MONTH(trl.created_at) = ' + month
            + ' GROUP BY trl.created_at) '
            + 'AS t '
            + 'GROUP BY MONTH; '
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results[0]);
        });
};

const getDetailrataMacetPerMonth = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            const date = new Moment();
            const month = date.month() + 1;
            return connection.query(''
            + 'SELECT '
            + 'SUM(rata) AS ' + formatString('rataMacet') + ', '
            + 'province_region_id, MONTH, YEAR '
            + 'FROM (SELECT SUM(trl.credibility) AS ' + formatString('rata') + ', '
            + 'province_region_id, MONTH(trl.created_at) AS ' + formatString('month') + ', '
            + 'YEAR(trl.created_at) AS ' + formatString('year') + ' '
            + 'FROM tbl_request_loans trl '
            + 'JOIN tbl_users tu ON tu.user_code = trl.user_code '
            + 'JOIN tbl_province tp ON tu.provinsi = tp.province_id '
            + 'WHERE trl.credibility = 4 AND trl.status_approval = 3 AND YEAR(trl.created_at) = ' + date.year() + ' AND MONTH(trl.created_at) = ' + month
            + ' GROUP BY trl.created_at) '
            + 'AS t '
            + 'GROUP BY MONTH; '
            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results[0]);
        });
};

// UPDATE REPORTING

// Update Reporting every day
// tbl_reporting_permohonan_peminjam
const updateReportingPermohonanPinjaman = function (monthId, regionId, jumlahOrang, jumlahPerusahaan, jumlahUang, avgTertimbangBunga, avgTertimbangTenor) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(' Update tbl_reporting_permohonan_peminjam '
            + 'SET jumlah_orang = ' + jumlahOrang + ', jumlah_perusahaan = ' + jumlahPerusahaan
            + ', jumlah_uang = ' + jumlahUang + ', rata_rata_tertimbang_bunga = ' + avgTertimbangBunga
            + ', rata_rata_tertimbang_tenor = ' + avgTertimbangTenor
            + ' WHERE month_id = ' + monthId + ' AND province_region_id = ' + regionId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateReportingPersetujuanPinjaman = function (monthId, regionId, jumlahOrangApprove, jumlahPerusahaanApprove, jumlahUangApprove, avgTertimbangBungaApprove, avgTertimbangTenorApprove) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(' Update tbl_reporting_persetujuan_peminjam '
            + 'SET jumlah_orang = ' + jumlahOrangApprove + ', jumlah_perusahaan = ' + jumlahPerusahaanApprove
            + ', jumlah_uang = ' + jumlahUangApprove + ', rata_rata_tertimbang_bunga = ' + avgTertimbangBungaApprove
            + ', rata_rata_tertimbang_tenor = ' + avgTertimbangTenorApprove
            + ' WHERE month_id = ' + monthId + ' AND province_region_id = ' + regionId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateReportingAkumulasiPinjaman = function (monthId, regionId, totalJumlahOrangAkumulasiPinjaman, totalJumlahPerusahaanAkumulasiPinjaman, totalJumlahUangAkumulasiPinjaman, totalRataRataTertimbangBungaAkumulasiPinjaman, totalRataRataTertimbangTenorAkumulasiPinjaman, totalRataStatusLancarAkumulasiPinjaman, totalRataStatusTidakLancarAkumulasiPinjaman, totalRataKreditMacetAkumulasiPinjaman) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(' Update tbl_reporting_status_akumulasi_pinjaman '
            + 'SET jumlah_orang = ' + totalJumlahOrangAkumulasiPinjaman + ', jumlah_perusahaan = ' + totalJumlahPerusahaanAkumulasiPinjaman
            + ', jumlah_uang = ' + totalJumlahUangAkumulasiPinjaman + ', rata_rata_tertimbang_bunga = ' + totalRataRataTertimbangBungaAkumulasiPinjaman
            + ', rata_rata_tertimbang_tenor = ' + totalRataRataTertimbangTenorAkumulasiPinjaman + ', rata_rata_status_lancar = ' + totalRataStatusLancarAkumulasiPinjaman
            + ', rata_rata_status_tidak_lancar = ' + totalRataStatusTidakLancarAkumulasiPinjaman + ', rata_rata_kredit_macet = ' + totalRataKreditMacetAkumulasiPinjaman
            + ' WHERE month_id = ' + monthId + ' AND province_region_id = ' + regionId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateReportingStatusPinjaman = function (monthId, regionId, totalRataStatuslancar, totalRataStatusTidakLancar, totalRataKreditMacet) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(' Update tbl_reporting_status_pinjaman '
            + 'SET rata_rata_status_lancar = ' + totalRataStatuslancar + ', rata_rata_status_tidak_lancar = ' + totalRataStatusTidakLancar
            + ', rata_rata_kredit_macet = ' + totalRataKreditMacet
            + ' WHERE month_id = ' + monthId + ' AND province_region_id = ' + regionId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updatePersonalPerMonth = function (monthId, regionId, jlhOrang) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_permohonan_peminjam '
                + 'SET jumlah_orang = ' + jlhOrang + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updatePersonalPerMonthApproved = function (monthId, regionId, jlhOrang) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_persetujuan_peminjam '
                + 'SET jumlah_orang = ' + jlhOrang + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateCorporatePerMonth = function (monthId, regionId, jlhPerusahaan) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_permohonan_peminjam '
                + 'SET jumlah_perusahaan = ' + jlhPerusahaan + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateCorporatePerMonthApproved = function (monthId, regionId, jlhPerusahaan) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_persetujuan_peminjam '
                + 'SET jumlah_perusahaan = ' + jlhPerusahaan + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateMoneyPerMonth = function (monthId, regionId, jlhUang) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_permohonan_peminjam '
                + 'SET jumlah_uang = ' + jlhUang + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateMoneyPerMonthApproved = function (monthId, regionId, jlhUang) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_persetujuan_peminjam '
                + 'SET jumlah_uang = ' + jlhUang + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updaterataBungaPerMonth = function (monthId, regionId, rataBunga) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_permohonan_peminjam '
                + 'SET rata_rata_tertimbang_bunga = ' + rataBunga + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updaterataBungaPerMonthApproved = function (monthId, regionId, rataBunga) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_persetujuan_peminjam '
                + 'SET rata_rata_tertimbang_bunga = ' + rataBunga + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updaterataTenorPerMonth = function (monthId, regionId, rataTenor) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_permohonan_peminjam '
                + 'SET rata_rata_tertimbang_tenor = ' + rataTenor + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updaterataTenorPerMonthApproved = function (monthId, regionId, rataTenor) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_persetujuan_peminjam '
                + 'SET rata_rata_tertimbang_tenor = ' + rataTenor + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updaterataLancarPerMonth = function (monthId, regionId, rataLancar) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_status_pinjaman '
                + 'SET rata_rata_status_lancar = ' + rataLancar + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updaterataTidakLancarPerMonth = function (monthId, regionId, rataTidakLancar) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_status_pinjaman '
                + 'SET rata_rata_status_tidak_lancar = ' + rataTidakLancar + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updaterataMacetPerMonth = function (monthId, regionId, rataMacet) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_status_pinjaman '
                + 'SET rata_rata_kredit_macet = ' + rataMacet + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

//Update Akumulasi Status
const updatePersonalPerMonthAkumulasi = function (monthId, regionId, jlhOrang) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_status_akumulasi_pinjaman '
                + 'SET jumlah_orang = ' + jlhOrang + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateCorporatePerMonthAkumulasi = function (monthId, regionId, jlhPerusahaan) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_status_akumulasi_pinjaman '
                + 'SET jumlah_perusahaan = ' + jlhPerusahaan + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateMoneyPerMonthAkumulasi = function (monthId, regionId, jlhUang) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_status_akumulasi_pinjaman '
                + 'SET jumlah_uang = ' + jlhUang + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updaterataBungaPerMonthAkumulasi = function (monthId, regionId, rataBunga) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_status_akumulasi_pinjaman '
                + 'SET rata_rata_tertimbang_bunga = ' + rataBunga + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updaterataTenorPerMonthAkumulasi = function (monthId, regionId, rataTenor) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_status_akumulasi_pinjaman '
                + 'SET rata_rata_tertimbang_tenor = ' + rataTenor + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updaterataLancarPerMonthAkumulasi = function (monthId, regionId, rataLancar) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_status_akumulasi_pinjaman '
                + 'SET rata_rata_status_lancar = ' + rataLancar + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updaterataTidakLancarPerMonthAkumulasi = function (monthId, regionId, rataTidakLancar) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_status_akumulasi_pinjaman '
                + 'SET rata_rata_status_tidak_lancar = ' + rataTidakLancar + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updaterataMacetPerMonthAkumulasi = function (monthId, regionId, rataMacet) {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_reporting_status_akumulasi_pinjaman '
                + 'SET rata_rata_kredit_macet = ' + rataMacet + ' '
                + 'WHERE month_id = ' + formatString(monthId) + ' AND province_region_id = ' + formatString(regionId) + ';'

            );
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};


module.exports = {
    getAllReportAging,
    getAllReportProfilIndividu,
    getAllReportProfilIPinjaman,
    getAllReportPermohonanPinjaman,
    getAllReportPersetujuanPinjaman,
    getAllReportStatusPinjaman,
    getAllReportStatusAkumulasiPinjaman,
    getAllRequestLoans,
    getListLoan,
    getContractNumber,
    getDetailInstallment,
    getDateOfDisburse,
    getCountUnpaidInstallment,
    getCollateralFileName,
    getListUser,
    getDetailUserByUserCode,
    getDetailCorporatePerMonth,
    getDetailPersonalPerMonthApproved,
    getDetailPersonalPerMonth,
    getDetailCorporatePerMonthApproved,
    getDetailMoneyPerMonth,
    getDetailMoneyPerMonthApproved,
    getDetailrataBungaPerMonth,
    getDetailrataBungaPerMonthApproved,
    getDetailrataTenorPerMonth,
    getDetailrataTenorPerMonthApproved,
    getDetailrataLancarPerMonth,
    getDetailrataTidakLancarPerMonth,
    getDetailrataMacetPerMonth,
    insertReportingAging,
    insertProfilIndividu,
    insertProfilPinjaman,
    insertPermohonanPinjaman,
    insertPersetujuanPinjaman,
    insertStatusLoans,
    insertStatusAkumulasiLoans,
    deleteAllReportingAging,
    deleteAllReportingIndividu,
    deleteAllReportingLoans,
    deleteAllReportingPermohonanPinjaman,
    deleteAllReportingPersetujuanPinjaman,
    deleteAllReportingStatus,
    deleteAllReportingStatusAkumulasi,
    updatePersonalPerMonth,
    updateCorporatePerMonth,
    updateMoneyPerMonth,
    updaterataBungaPerMonth,
    updaterataTenorPerMonth,
    updatePersonalPerMonthApproved,
    updateCorporatePerMonthApproved,
    updateMoneyPerMonthApproved,
    updaterataBungaPerMonthApproved,
    updaterataTenorPerMonthApproved,
    updaterataLancarPerMonth,
    updaterataTidakLancarPerMonth,
    updaterataMacetPerMonth,
    updatePersonalPerMonthAkumulasi,
    updateCorporatePerMonthAkumulasi,
    updateMoneyPerMonthAkumulasi,
    updaterataBungaPerMonthAkumulasi,
    updaterataTenorPerMonthAkumulasi,
    updaterataLancarPerMonthAkumulasi,
    updaterataTidakLancarPerMonthAkumulasi,
    updaterataMacetPerMonthAkumulasi,
    updateReportingPermohonanPinjaman,
    updateReportingPersetujuanPinjaman,
    getPermohonanPeminjam,
    getPersetujuanPeminjam,
    getStatusAkumulasiPeminjam,
    getStatusPeminjam,
    updateReportingAkumulasiPinjaman,
    updateReportingStatusPinjaman,
    insertPosisiKeuangan,
    insertLabaRugi,
    getLabaRugi,
    getPosisiKeuangan,
    getListLoanReporting,
    getDataForm3C
};
