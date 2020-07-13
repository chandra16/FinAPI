'use strict';

const TIME_DIFF_LIMIT = () => { return 300; };

const tsDiff = (ts) => { return Math.abs(ts - Math.round(+new Date() / 1e3)) <= TIME_DIFF_LIMIT(); };

const strPad = (str, length, padChar, padLeft) => {
	while (str.length < length) {
		str = padLeft ? padChar + str : str + padChar;
    }

	return str;
};

const dec = (str, sck) => {
	let res = '';
	const strls = str.length;
	const strlk = sck.length;
	for (let i = 0; i < strls; i++) {
		let chr = str.substr(i, 1);
		const keychar = sck.substr((i % strlk) - 1, 1);
		chr = String.fromCharCode(((chr.charCodeAt() - keychar.charCodeAt()) + 256) % 128);
		res += chr;
    }

	return res;
};

const enc = (str, sck) => {
	let res = '';
	const strls = str.length;
	const strlk = sck.length;
	for (let i = 0; i < strls; i++) {
		let chr = str.substr(i, 1);
		const keychar = sck.substr((i % strlk) - 1, 1);
		chr = String.fromCharCode((chr.charCodeAt() + keychar.charCodeAt()) % 128);
		res += chr;
    }

	return res;
};

const doubleDecrypt = (str, cid, sck) => {
	let res = Buffer.from(strPad(str, Math.ceil(str.length / 4) * 4, '=', 0).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
	res = dec(res, cid);
	res = dec(res, sck);
	return res;
};

const doubleEncrypt = (str, cid, sck) => {
	let res = '';
	res = enc(str, cid);
	res = enc(res, sck);
	return Buffer.from(res, 'utf8').toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const encrypt = (jsonData, cid, sck) => {
	return doubleEncrypt(('' + Math.round(+new Date() / 1e3)).split('').reverse().join('') + '.' + JSON.stringify(jsonData), cid, sck);
};

const decrypt = (hashedString, cid, sck) => {
	const parsedString = doubleDecrypt(hashedString, cid, sck);
	const dotPos = parsedString.indexOf('.');
	if (dotPos < 1) {
        return null;
    }

	const ts = parsedString.substr(0, dotPos);
	const data = parsedString.substr(dotPos + 1);
	if (tsDiff(ts.split('').reverse().join('')) === true) {
		return JSON.parse(data);
    }

	return null;
};

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
};
