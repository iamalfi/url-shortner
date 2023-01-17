const express = require("express");
const router = express.Router();

const controller = require("../controllers/controller");

router.get("/test", function (req, res) {
    res.send("working");
});
router.post("/url/shorten", controller.createUrl);
router.get("/:urlCode", controller.geturl);

router.all("/*", function (req, res) {
    res.status(404).send({ status: false, message: "invalid url" });
});

module.exports = router;
