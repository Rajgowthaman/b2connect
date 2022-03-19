const jwt = require('jsonwebtoken');
const mongooseSchema = require('../schema/mongooseSchema');
const {log} = require('../utils/logger');
const constants = require('../utils/constants');

exports.authenticateJWT = (req, res, next) => {
    if (req.session.accessToken && req.session.refreshToken) {
        const accessToken = req.session.accessToken.split(' ')[1];
        const refreshToken = req.session.refreshToken.split(' ')[1];
        jwt.verify(accessToken, constants.ACCESS_TOKEN_SECRET, (err, userInfo) => {
            if (err ) {
                //log.info({name:err.name,message:err.message, expiredAt:err.expiredAt});
                if(err.message === 'jwt expired'){
                    log.info("Access token expired, verifying access token");
                    jwt.verify(refreshToken, constants.REFRESH_TOKEN_SECRET, (err, userInfo) => {
                        if (err) {
                            //log.info({name:err.name,message:err.message, expiredAt:err.expiredAt});
                            log.info("Refresh Token Expired"); 
                            return res.sendStatus(403);
                        } else{
                            req.session.email = userInfo.email;
                            req.session.role = userInfo.role;
                            req.session.firstName = userInfo.firstName;
                            req.session.lastName = userInfo.lastName;
                            const accessToken = jwt.sign({ email: userInfo.email, role: userInfo.role, firstName: userInfo.firstName, lastName: userInfo.lastName  }, constants.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
                            const refreshToken = jwt.sign({ email: userInfo.email, role: userInfo.role, firstName: userInfo.firstName, lastName: userInfo.lastName  }, constants.REFRESH_TOKEN_SECRET, { expiresIn: '2m' });
                            let sessionData = {
                                appGuid: null,
                                email: userInfo.email,
                                role: userInfo.role,
                                accessTokenRandomValue: accessToken,
                                refreshTokenRandomValue: refreshToken,
                                loginTime: new Date(),
                                accessTime: new Date()
                            }
                            mongooseSchema.sessions.updateOne({email: userInfo.email}, sessionData, (err, session) => {
                                if (err) {
                                    res.status(500).send("Something went wrong");
                                } else {
                                    res.set({
                                        accessToken,
                                        refreshToken
                                    });
                                    next();
                                }
                            })
                        }
                    });
                } else {
                    log.info("Access Token Invalid");
                    return res.sendStatus(403);
                }
            } else {
                req.session.email = userInfo.email;
                req.session.role = userInfo.role;
                req.session.firstName = userInfo.firstName;
                req.session.lastName = userInfo.lastName;
                next();
            }
        });
    } else {
        res.sendStatus(401);
    }
}