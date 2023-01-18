const urlModel = require("../models/model");
const { isValid } = require('../validators/validator');
const shortid = require("shortid");
const validUrl = require("valid-url")
const redis = require ("redis")
const { promisify } = require("util");

//Connect to redis
// we make client of name redesclient

const redisClient = redis.createClient(
    18265 ,                                                 // port-number
    "redis-18265.c301.ap-south-1-1.ec2.cloud.redislabs.com",//host name and url of redis
    {no_ready_check: true}
);

    redisClient.auth("ysDNRyfBElfft4UKeapXaAF1fAJmTujy", function (err){  // it authenticate the client
        if (err) throw err;
    });

    //on is the listener which when we event is listen then it print in console
    redisClient.on("connect", async function(){       
        console.log("Successfully conected to redis")
    })



//create URL -----------------------------------------------------------------------------------------------

exports.createUrl = async function (req, res) {
    try {
        let data = req.body;
        let reqLongUrl = data.longUrl
        if (Object.keys(data).length==0) return res.status(400).send({status:false, message:"please enter some data in body"})

        if (!isValid(reqLongUrl))return res.status(400).send({ status: false, message: "please provide the longUrl" });
        reqLongUrl = reqLongUrl.trim()

        if (!validUrl.isWebUri(reqLongUrl)) return res.status(400).send({ status: false, message: "enter valid Url" });

        let urlDetails = {};

        urlDetails = await urlModel.findOne({ longUrl: reqLongUrl}).select({longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0});

        if (urlDetails)return res.status(200).send({ status: true, data: urlDetails });
        let urlcode = shortid.generate(reqLongUrl).toLowerCase();
        data.shortUrl = "http://localhost:3000/"+ urlcode
        data.urlCode = urlcode;

        const urlCreated = await urlModel.create(data);

        const { longUrl, shortUrl, urlCode } = urlCreated;

        res.status(201).send({status: true,data: { longUrl, shortUrl, urlCode },});
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

// get url-----------------------------------------------------------------------------------------------------

exports.geturl = async (req, res) => {
    try {
        let urlCode = req.params.urlCode;

        if (!isValid(urlCode.trim())) return res.status(400).send({status: false, message: 'please enter a valid urlCode'});


        let data = await urlModel.findOne({ urlCode });
        if (!data) {
            return res.status(404).send({ status: false, message: "Url not found" });
        };

        res.status(200).send({ status: true, data: data.longUrl});
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

