const express = require("express");
const router = express.Router();

router.get("/profile", (req, res) => {
  res.json({
    msg: "This is profile Routes",
  });
});

module.exports = router;
