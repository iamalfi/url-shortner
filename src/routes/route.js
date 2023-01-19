const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");


router.post("/url/shorten", controller.createUrl); //create short-url
router.get("/:urlCode", controller.geturl); // get long url

router.all("/*", function (req, res) {
    res.status(404).send({ status: false, message: "invalid url" });
});

module.exports = router;
