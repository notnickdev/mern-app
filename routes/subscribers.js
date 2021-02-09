const express = require("express");

// Model
const Subscriber = require("../models/subscriber.model");

const router = express.Router();

// GET /subscribers
router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();

    res.send(subscribers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET /subscribers/:id
router.get("/:id", getSubscriber, (req, res) => {
  res.json({
    data: res.subscriber,
  });
});

// POST (CREATE) /subscribers
router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel,
  });

  try {
    await subscriber.save();
    res.status(201).json(subscriber);
  } catch (error) {
    // Fails if user doesn't provide the required information or if we're given bad data
    res.status(400).send({
      message: error.message,
    });
  }
});

// PATCH (UPDATE) /subscribers/:id
router.patch("/:id", getSubscriber, async (req, res) => {
  // Checks if the required information is provided
  if (req.body.name !== null && req.body.subscribedToChannel !== null) {
    res.subscriber.name = req.body.name;
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel;
  }

  try {
    await res.subscriber.save();
    res.send({
      data: res.subscriber,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

// DELETE /subscribers/:id
router.delete("/:id", getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove();

    // Send back a json response if the subscriber is deleted
    res.json({
      message: "Subscriber deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Middleware - Gets the single subscriber by id
async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id);

    // Runs if the subscriber can't be found
    if (subscriber === null) {
      return res.status(404).json({
        message: "Cannot find subscriber",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  // Creates a `subscriber` on the response object
  res.subscriber = subscriber;

  // If we're able to fetch that single subscriber then move on to the next operation
  next();
}

module.exports = router;
