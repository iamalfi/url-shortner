const urlModel = require('../models/model');
const shortid = require('shortid');

const createUrl = async function (req, res) {
    const data = req.body;

    if (!data.longUrl) return res.status(400).send({status: false, message: 'please provide the longUrl'});

    let urlDetails = {};

    urlDetails = await urlModel.findOne({longUrl: data.longUrl});
    if (urlDetails) return res.status(400).send({status: false, message: 'please enter a unique longUrl'});



    let urlCode = shortid.generate(data.longUrl); 
    data.shortUrl = `http://localhost:3000/${urlCode}` 
    data.urlCode = urlCode 

    const urlCreated = await urlModel.create(data);

    res.send({a: urlCode, b: data.shortUrl});
    // urlDetails = await
};

module.exports = {createUrl};