const path = require("path");

const authenticateJWT = require("../middleware/auth");

const express = require("express");

const bookingController = require("../controllers/booking");

const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/hotels", bookingController.getHotelsHeader);

router.get("/hotels/search", bookingController.getSearchHotels);

router.get("/hotels/:hotelId", bookingController.getHotelDetail);

router.get("/hotels/:hotelId/rooms", bookingController.getHotelRoomsDetail);

router.post("/booking", authenticateJWT, bookingController.postBooking);

router.post(
  "/transaction",
  authenticateJWT,
  bookingController.postTransactions
);

// router.get("/orders", shopController.getOrders);

module.exports = router;
