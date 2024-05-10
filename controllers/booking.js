const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Transaction = require("../models/transaction");

exports.getHotelsHeader = async (req, res, next) => {
  let city;
  if (!req.query.city && !req.query.type && req.query.topRated !== "true") {
    return res.status(400).json({ status: 400, message: "Not found!" });
  }

  if (req.query.city === "dng" || req.query.city === "Da Nang") {
    city = "Da Nang";
  } else if (req.query.city === "hcm" || req.query.city === "Ho Chi Minh") {
    city = "Ho Chi Minh";
  } else if (req.query.city === "hn" || req.query.city === "Ha Noi") {
    city = "Ha Noi";
  }

  if (city) {
    Hotel.find({ city })
      .then((hotel) => {
        return res.status(200).json({
          status: 200,
          results: hotel,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (req.query.type) {
    Hotel.find({ type: req.query.type })
      .then((hotel) => {
        return res.status(200).json({
          status: 200,
          results: hotel,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (req.query.topRated === "true") {
    try {
      const hotel = await Hotel.find().sort({ rating: -1 }).limit(4);

      return res.status(200).json({
        status: 200,
        results: hotel,
      });
    } catch (err) {
      console.log(err);
    }
  }
};

exports.getSearchHotels = async (req, res, next) => {
  const { city, checkin, checkout, people, rooms } = req.query;
  const numberOfRooms = parseInt(rooms);
  const numberOfPeople = parseInt(people);

  try {
    const hotel = await Hotel.find({
      city: city,
      $expr: {
        $gte: [
          {
            $size: { $ifNull: ["$rooms", []] },
          },
          numberOfRooms,
        ],
      },
    });

    return res.status(200).json({
      status: 200,
      results: hotel,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getHotelDetail = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId).populate("rooms");

    return res.status(200).json({
      status: 200,
      results: hotel,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getHotelRoomsDetail = async (req, res, next) => {
  try {
    const rooms = await Hotel.findById(req.params.hotelId).populate("rooms");

    return res.status(200).json({
      status: 200,
      results: rooms,
    });
  } catch (err) {
    res.status(500).json({ message: "Error get hotel room detail", err });
  }
};

exports.postBooking = async (req, res, next) => {
  const {
    user,
    hotel,
    room,
    roomId,
    dateStart,
    dateEnd,
    price,
    payment,
    status,
    createdAt,
  } = req.body;

  try {
    const transaction = await new Transaction({
      user,
      hotel,
      room,
      roomId,
      dateStart,
      dateEnd,
      price,
      payment,
      status,
      createdAt,
    });

    await transaction.save();

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating transaction", error });
  }
};

exports.postTransactions = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const findTransaction = await Transaction.find({ user: userId }).populate({
      path: "hotel",
      select: "name",
    });

    return res.status(200).json({
      status: 200,
      results: findTransaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error find transaction", error });
  }
};
