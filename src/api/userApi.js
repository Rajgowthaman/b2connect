const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mongooseSchema = require('../schema/mongooseSchema');
const {log} = require('../utils/logger');
const constants = require('../utils/constants');

exports.login = (req, res) => {
    // read username and password from request body
    log.info('Login')
    const user = mongooseSchema.users.findOne({"email": req.body.email}, function (err, doc) {
        if (err){
            log.error(err);
            res.status(500).send('Username or password incorrect');
        }
        else{
            if(doc){
                if (bcrypt.compareSync(req.body.password, doc.password)) {
                    log.info("Hash matched")
                    // generate an access token
                    const accessToken = jwt.sign({ email: doc.email, role: doc.role, firstName: doc.firstName, lastName: doc.lastName }, constants.ACCESS_TOKEN_SECRET, { expiresIn: constants.ACCESS_TOKEN_EXPIRY });
                    const refreshToken = jwt.sign({ email: doc.email, role: doc.role, firstName: doc.firstName, lastName: doc.lastName  }, constants.REFRESH_TOKEN_SECRET, { expiresIn: constants.REFRESH_TOKEN_EXPIRY});
                    let sessionData = {
                        appGuid: req.body.appGuid,
                        email: req.body.email,
                        role: doc.role,
                        accessTokenRandomValue: accessToken,
                        refreshTokenRandomValue: refreshToken,
                        loginTime: new Date(),
                        accessTime: new Date()
                    }
                    mongooseSchema.sessions.updateOne({email: req.body.email}, sessionData, {"upsert": true}, (err, session) => {
                        if (err) {
                            log.error(err);
                            res.status(500).send("Something went wrong");
                        } else {
                            res.set({
                                accessToken,
                                refreshToken
                            });
                            req.session.accessToken = 'JWT '+accessToken;
                            req.session.refreshToken = 'JWT '+refreshToken;
                            res.status(200).send("Login Success");
                            log.info("Response sent");
                        }
                    })
                } else {
                    log.info("Hash mismatch")
                    res.status(500).send('Username or password incorrect');
                }
            } else {
                log.info("User not found")
                res.status(500).send('User not found');
            }
        }
    });
}

exports.signup = (req, res) => {
    // read username and password from request body
    log.info('Signup')
    mongooseSchema.users.findOne({email:req.body.email}, function(err, user){
        if(err) log.info(err);
        if (user){
            return res.status(500).send("User already exists");
        } else {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            let userObj = new mongooseSchema.users(req.body);
            userObj.save(function(err, example) {
                if(err){ 
                    log.info(err);
                    return res.status(500).send("Error signing up");
                }
                return res.status(200).send("User created successfully");
            });
        }
    });
}