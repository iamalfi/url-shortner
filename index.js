const express = require('express');
const app = express();
app.use(express.json());

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://mnu4513:monu8181@firstcluster.daae6aq.mongodb.net/url-short-group1", { useNewUrlParser: true })
    .then(() => {
        console.log("mongoDB is connected");
    })
    .catch((err) => {
        console.log(err);
    });

const route = require('./src/routes/route');
app.use('/', route);

app.listen(process.env.PORT || 3001, function () {
    console.log('server is runnign on prot' + process.env.PORT || 3001)
});