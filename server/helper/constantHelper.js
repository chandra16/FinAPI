const Fs = require('fs');
const Path = require('path');

const JsonPath = Path.join(__dirname, '../../assets/fixedConstant.json');

exports.getValue = (key) => {
    return new Promise((resolve, reject) => {
        return Fs.readFile(JsonPath, 'utf8', (err, content) => {
        if (err) {
            return reject({ err: err });
        }

        var parsedJSON = JSON.parse(content);
        return resolve((parsedJSON[key]) ? parsedJSON[key] : null);
        });
    });
};
