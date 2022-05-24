const express = require("express");
const router = express.Router();
const tableController = require("../controllers/table");

router.get("/table", tableController.getAllTable);
router.post("/table", tableController.newTable);
router.delete("/table", tableController.clearTable);
router.get("/table/:id", tableController.getTable);

router.put("/table/reserve", tableController.reserveTable);
router.put("/table/cancel/:id", tableController.cancelReserveTable);

module.exports = router;
