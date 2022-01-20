const fs = require('fs');
const path = require('path');

const version = process.argv[2];
const composerFilePath = path.join(__dirname, '../composer.json');
const composerFile = JSON.parse(fs.readFileSync(composerFilePath));
composerFile['version'] = version;
fs.writeFileSync(composerFilePath, JSON.stringify(composerFile, null, 4));
