
const env = require("dotenv");
const randomstring = require("randomstring");
const accessTokenSecret = randomstring.generate(15);
const refreshTokenSecret = randomstring.generate(15);
console.log('env', process.env.ENVIRONMENT);
if (!process.env.ENVIRONMENT || process.env.ENVIRONMENT === "DEV") {
    env.config({ path: './local.env' });
} /*else if (process.env.ENVIRONMENT === "UAT") {
    env.config({ path: './uat.env' });
}*/ else if (process.env.ENVIRONMENT === "PROD") {
    env.config({ "path": "./prod.env" });
}
console.log(process.env.PORT);

exports.PORT = parseInt(process.env.PORT);
exports.ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
exports.REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
exports.ACCESS_TOKEN_SECRET = accessTokenSecret;
exports.REFRESH_TOKEN_SECRET = refreshTokenSecret;
exports.MONGOURI = process.env.MONGOURI;