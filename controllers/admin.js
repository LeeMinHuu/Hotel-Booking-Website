const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Transaction = require("../models/transaction");
const User = require("../models/user");

exports.getOverview = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments({});
    const transactionCount = await Transaction.countDocuments({});
    const revenue = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$price",
          },
        },
      },
    ]);

    const transactionList = await Transaction.find({})
      .populate({ path: "user", select: "username" })
      .populate({ path: "hotel", select: "name" })
      .sort({ createdAt: -1 })
      .limit(8);

    return res.status(200).json({
      status: 200,
      results: {
        numberOfUsers: userCount,
        numberOfTransaction: transactionCount,
        revenue: revenue[0].total,
        transactionList,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error ", error });
  }
};

exports.getTransactionList = async (req, res, next) => {
  try {
    const transactionList = await Transaction.find({})
      .populate({ path: "user", select: "username" })
      .populate({ path: "hotel", select: "name" });

    return res.status(200).json({
      status: 200,
      results: transactionList,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error get transaction list", error });
  }
};

exports.getHotelsList = async (req, res, next) => {
  try {
    const hotel = await Hotel.find({});

    return res.status(200).json({
      status: 200,
      results: hotel,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error get Hotel List", error });
  }
};

exports.deleteHotel = async (req, res, next) => {
  const hotelId = req.params.hotelId;

  try {
    const transaction = await Transaction.findOne({ hotel: hotelId });

    if (transaction) {
      return res
        .status(400)
        .json({ message: "Cannot delete hotel involved in a transaction" });
    } else {
      await Hotel.findByIdAndDelete(hotelId);
      return res.status(200).json({ message: "Hotel deleted successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error deleting hotel", error });
  }
};

exports.getRoomsList = async (req, res, next) => {
  try {
    const room = await Room.find({});

    return res.status(200).json({
      status: 200,
      results: room,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error getting all rooms", error });
  }
};

exports.deleteRoom = async (req, res, next) => {
  const roomId = req.params.roomId;
  console.log(roomId);

  try {
    const transaction = await Transaction.findOne({
      roomId: roomId,
    });

    if (transaction) {
      return res
        .status(400)
        .json({ message: "Cannot delete room involved in a transaction" });
    } else {
      await Room.findByIdAndDelete(roomId);
      res.status(200).json({ message: "Room deleted successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting room", error });
  }
};

exports.postAddHotel = async (req, res, next) => {
  const {
    name,
    type,
    title,
    description,
    address,
    city,
    distance,
    price,
    rooms,
    images,
    featured,
  } = req.body;
  const featuredBoolean = featured === "true";

  try {
    const hotel = new Hotel({
      name,
      type,
      title,
      desc: description,
      address,
      city,
      distance,
      cheapestPrice: price,
      rooms,
      photos: images.split(","),
      featured: featuredBoolean,
    });

    await hotel.save();
    console.log(hotel);

    return res.status(201).json({
      message: "Hotel created successfully",
      hotel,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating hotel", error });
  }
};

exports.postAddRoom = async (req, res, next) => {
  const { title, description, price, maxPeople, roomNumbers, hotel } = req.body;
  try {
    const room = new Room({
      title,
      desc: description,
      price,
      maxPeople,
      roomNumbers: roomNumbers.split(","),
    });
    await room.save();
    console.log(room);

    await Hotel.findByIdAndUpdate(hotel, {
      $push: {
        rooms: { $each: [room._id] },
      },
    });

    return res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating room", error });
  }
};
