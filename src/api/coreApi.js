const mongooseSchema = require('../schema/mongooseSchema');
const {log} = require('../utils/logger');
const geoip = require('geoip-lite');

exports.ipLookup = (req, res) => {
    log.info('IP lookup');
    let geo = geoip.lookup(req.body.ip);
    if(geo){
        res.status(200).send(geo);
    }
    else{
        res.status(500).send("Cannot be found");
    }
}