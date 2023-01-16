const urlModel = require("../models/model");
const shortid = require("shortid");

const createUrl = async function (req, res) {
    const data = req.body;
    console.log(data);
    if (!data.longUrl)
        return res
            .status(400)
            .send({ status: false, message: "please provide the longUrl" });

    let urlDetails = {};

    urlDetails = await urlModel.findOne({ longUrl: data.longUrl });
    if (urlDetails)
        return res
            .status(400)
            .send({ status: false, message: "please enter a unique longUrl" });

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
};

const geturl = async (req, res) => {
    let urlCode = req.params.urlCode;
    if (!shortid.isValid(urlCode)) {
        return res
            .status(400)
            .json({ status: false, msg: "short url is not valid" });
    }
    let data = await urlModel.findOne({ urlCode });
    if (!data) {
        return res.status(404).json({ status: false, msg: "Url not found" });
    }
    res.status(200).json({ status: true, longUrl: data.longUrl });
};

module.exports = { createUrl, geturl };
