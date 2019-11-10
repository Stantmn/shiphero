const dotenv = require('dotenv').config();

const config = {
    apiRoot: process.env.API_ROOT,
    labelURL: process.env.LABEL_URL,
    bgLabelURL: process.env.BG_LABEL_URL,
    appKey: process.env.APP_KEY
};
module.exports = config;
