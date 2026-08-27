const express = require("express");
const { checkSymptoms, getMyHistory } = require("../controllers/symptomCheckController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/", requireAuth, checkSymptoms);
router.get("/history", requireAuth, getMyHistory);

module.exports = router;
