const urlModel = require("../models/model");
const { validUrl, validUrlCode } = require('../validators/validator');

const shortid = require("shortid");

const createUrl = async function (req, res) {
    try {
        const data = req.body;

        if (!data.longUrl)
            return res
                .status(400)
                .send({ status: false, message: "please provide the longUrl" });

        if (validUrl(data.longUrl)) return res.status(400).send({ status: false, message: "please enter a valid longUrl" });

        let urlDetails = {};

        urlDetails = await urlModel.findOne({ longUrl: data.longUrl }).select({longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0});
        if (urlDetails)
            return res
                .status(200)
                .send({ status: true, data: urlDetails });

        let urlcode = shortid.generate(data.longUrl);

        data.shortUrl = `http://localhost:3000/${urlcode}`;
        data.urlCode = urlcode;

        urlDetails = await urlModel.findOne({ urlCode: data.urlCode });
        if (urlDetails)
            return res
                .status(400)
                .send({ status: false, message: "please use a unique urlCode" });

        urlDetails = await urlModel.findOne({ shortUrl: data.shortUrl });
        if (urlDetails)
            return res
                .status(400)
                .send({ status: false, message: "please use a unique shortUrl" });

        const urlCreated = await urlModel.create(data);

        const { longUrl, shortUrl, urlCode } = urlCreated;

        res.status(201).send({
            status: true,
            data: { longUrl, shortUrl, urlCode },
        });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const geturl = async (req, res) => {
    try {
        let urlCode = req.params.urlCode;

        if (!validUrlCode(urlCode)) return res.status(400).send({status: false, message: 'please enter a valid urlCode'});


        let data = await urlModel.findOne({ urlCode });
        if (!data) {
            return res.status(404).send({ status: false, msg: "Url not found" });
        };

        res.status(200).send({ status: true, longUrl: data.longUrl });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

module.exports = { createUrl, geturl };
