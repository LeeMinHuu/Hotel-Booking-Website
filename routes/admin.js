const path = require("path");

const adminAuthenticateJWT = require("../middleware/adminAuth");
const express = require("express");

// Check admin rights
const adminController = require("../controllers/admin");

const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get(
  "/admin/overview",
  adminAuthenticateJWT,
  adminController.getOverview
);

router.get(
  "/admin/transaction-list",
  adminAuthenticateJWT,
  adminController.getTransactionList
);

router.get(
  "/admin/hotel-list",
  adminAuthenticateJWT,
  adminController.getHotelsList
);

router.delete(
  "/admin/delete/hotel/:hotelId",
  adminAuthenticateJWT,
  adminController.deleteHotel
);

router.get(
  "/admin/room-list",
  adminAuthenticateJWT,
  adminController.getRoomsList
);

router.delete(
  "/admin/delete/room/:roomId",
  adminAuthenticateJWT,
  adminController.deleteRoom
);

router.post(
  "/admin/add/hotel",
  adminAuthenticateJWT,
  adminController.postAddHotel
);

router.post(
  "/admin/add/room",
  adminAuthenticateJWT,
  adminController.postAddRoom
);

module.exports = router;
