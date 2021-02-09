const express = require("express");

const Channel = require("../models/channel.model");

const router = express.Router();

// GET /channels
router.get("/", async (req, res) => {
  try {
    const channel = await Channel.find();
    res.send(channel);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET /channels/:id
router.get("/:id", getChannel, async (req, res) => {
  res.json({
    data: res.channel,
  });
});

// POST /channels
router.post("/", async (req, res) => {
  const channel = new Channel({
    channelName: req.body.channelName,
    email: req.body.email,
    subscribers: req.body.subscribers,
  });

  try {
    await channel.save();
    res.status(201).send(channel);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

// PATCH (UPDATE) /channels/:id
router.patch("/:id", getChannel, async (req, res) => {
  // Checks if the information is correct
  if (
    req.body.channelName !== null &&
    req.body.email !== null &&
    req.body.subscribers !== null
  ) {
    res.channel.channelName = req.body.channelName;
    res.channel.email = req.body.email;
  }

  try {
    await res.channel.save();
    res.send({
      data: res.channel,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.delete("/:id", getChannel, async (req, res) => {
  try {
    await res.channel.remove();

    // Send back a json response if the subscriber is deleted
    res.json({
      message: "Channel has been removed",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Middleware
async function getChannel(req, res, next) {
  let channel;

  try {
    channel = await Channel.findById(req.params.id);

    // Runs if the channel isn't found
    if (channel === null) {
      return res.status(404).json({
        message: "Cannot find this channel",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  res.channel = channel;
  next();
}

module.exports = router;
