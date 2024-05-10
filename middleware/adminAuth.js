const express = require("express");
const bodyParser = require("body-parser");

const jwt = require("jsonwebtoken");
const app = express();

const jwtSecretKey = "secretKey";

app.use(bodyParser.json());

const adminAuthenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, jwtSecretKey, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Failed to authenticate token.",
        });
      }

      // Check isAdmin
      if (!user.isAdmin) {
        return res.status(403).send({ message: "You don't have admin role." });
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401).json({
      status: 401,
      message: "Unauthorized",
    });
    return;
  }
};

module.exports = adminAuthenticateJWT;
