const urlModel = require('../models/model');
const shortid = require('shortid');

const createUrl = async function (req, res) {
    const data = req.body;

    if (!data.longUrl) return res.status(400).send({status: false, message: 'please provide the longUrl'});

    let urlDetails = {};

    urlDetails = await urlModel.findOne({longUrl: data.longUrl});
    if (urlDetails) return res.status(400).send({status: false, message: 'please enter a unique longUrl'});

    let urlcode = shortid.generate(data.longUrl); 
    data.shortUrl = `http://localhost:3000/${urlcode}` 
    data.urlCode = urlcode 

    urlDetails = await urlModel.findOne({urlCode: data.urlCode});
    if (urlDetails) return res.status(400).send({status: false, message: 'please use a unique urlCode'});

    urlDetails = await urlModel.findOne({shortUrl: data.shortUrl});
    if (urlDetails) return res.status(400).send({status: false, message: 'please use a unique shortUrl'});

    const urlCreated = await urlModel.create(data);

    const {longUrl, shortUrl, urlCode} = urlCreated;
    
    res.status(201).send({status: true, data: {longUrl, shortUrl, urlCode}})
    
};

module.exports = {createUrl};