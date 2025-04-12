const express = require("express");
const aiController = require("../controllers/ai.controller");

const router = express.Router();
// const { generateContent } = require("../services/ai.services");

router.post("/get-review", aiController.getReview);

module.exports = router;
