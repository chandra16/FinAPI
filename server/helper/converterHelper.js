const spellNumber = (amount) => {
	const bilangan = ['','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan','Sepuluh','Sebelas'];
    let kalimat;
    let utama;
    let depan;
    let belakang;
	// 1 - 11
	if(amount < 12){
		kalimat = bilangan[amount];
	}
	// 12 - 19
	else if(amount < 20){
		kalimat = bilangan[amount - 10] + ' Belas';
	}
	// 20 - 99
	else if(amount < 100){
		utama = amount / 10;
		depan = parseInt(String(utama).substr(0,1));
		belakang = amount % 10;
		kalimat = bilangan[depan] + ' Puluh ' + bilangan[belakang];
	}
	// 100 - 199
	else if(amount < 200){
		kalimat = 'Seratus ' + spellNumber(amount - 100);
	}
	// 200 - 999
	else if(amount < 1000){
		utama = amount / 100;
		depan = parseInt(String(utama).substr(0,1));
		belakang = amount % 100;
		kalimat = bilangan[depan] + ' Ratus ' + spellNumber(belakang);
	}
	// 1,000 - 1,999
	else if(amount < 2000){
		kalimat = 'Seribu ' + spellNumber(amount - 1000);
	}
	// 2,000 - 9,999
	else if(amount < 10000){
		utama = amount / 1000;
		depan = parseInt(String(utama).substr(0,1));
		belakang = amount % 1000;
		kalimat = bilangan[depan] + ' Ribu ' + spellNumber(belakang);
	}
	// 10,000 - 99,999
	else if(amount < 100000){
		utama = amount / 100;
		depan = parseInt(String(utama).substr(0,2));
		belakang = amount % 1000;
		kalimat = spellNumber(depan) + ' Ribu ' + spellNumber(belakang);
	}
	// 100,000 - 999,999
	else if(amount < 1000000){
		utama = amount / 1000;
		depan = parseInt(String(utama).substr(0,3));
		belakang = amount % 1000;
		kalimat = spellNumber(depan) + ' Ribu ' + spellNumber(belakang);
	}
	// 1,000,000 - 	99,999,999
	else if(amount < 100000000){
		utama = amount / 1000000;
		depan = parseInt(String(utama).substr(0,4));
		belakang = amount % 1000000;
		kalimat = spellNumber(depan) + ' Juta ' + spellNumber(belakang);
	}
	else if(amount < 1000000000){
		utama = amount / 1000000;
        depan = parseInt(String(utama).substr(0,4));
		belakang = amount % 1000000;
		kalimat = spellNumber(depan) + ' Juta ' + spellNumber(belakang);
	}
	else if(amount < 10000000000){
		utama = amount / 1000000000;
		depan = parseInt(String(utama).substr(0,1));
		belakang = amount % 1000000000;
		kalimat = spellNumber(depan) + ' Milyar ' + spellNumber(belakang);
	}
	else if(amount < 100000000000){
		utama = amount / 1000000000;
		depan = parseInt(String(utama).substr(0,2));
		belakang = amount % 1000000000;
		kalimat = spellNumber(depan) + ' Milyar ' + spellNumber(belakang);
	}
	else if(amount < 1000000000000){
		utama = amount / 1000000000;
		depan = parseInt(String(utama).substr(0,3));
		belakang = amount % 1000000000;
		kalimat = spellNumber(depan) + ' Milyar ' + spellNumber(belakang);
	}
	else if(amount < 10000000000000){
		utama = amount / 10000000000;
		depan = parseInt(String(utama).substr(0,1));
		belakang = amount % 10000000000;
		kalimat = spellNumber(depan) + ' Triliun ' + spellNumber(belakang);
	}
	else if(amount < 100000000000000){
		utama = amount / 1000000000000;
		depan = parseInt(String(utama).substr(0,2));
		belakang = amount % 1000000000000;
		kalimat = spellNumber(depan) + ' Triliun ' + spellNumber(belakang);
	}

	else if(amount < 1000000000000000){
		utama = amount / 1000000000000;
		depan = parseInt(String(utama).substr(0,3));
		belakang = amount % 1000000000000;
		kalimat = spellNumber(depan) + ' Triliun ' + spellNumber(belakang);
	}

  else if(amount < 10000000000000000){
		utama = amount / 1000000000000000;
		depan = parseInt(String(utama).substr(0,1));
		belakang = amount % 1000000000000000;
        kalimat = spellNumber(depan) + ' Kuadriliun ' + spellNumber(belakang);
	}

	const pisah = kalimat.split(' ');
	const full = [];
	for(let index = 0; index < pisah.length; index++){
        if(pisah[index] !== '') {
            full.push(pisah[index]);
        }
    }

	return full.join(' ');
};

const currencyFormat = (num) => {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

module.exports = {
    currencyFormat,
    spellNumber
};
