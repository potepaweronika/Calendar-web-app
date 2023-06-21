const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const tokenVerification = require("../middleware/tokenVerification");
const { Event, validateEvent } = require("../models/event");

// Create a new event
router.post("/", tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;

    const { error } = validateEvent(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      start: req.body.start,
      end: req.body.end,
      color: req.body.color,
      user: userId,
    });

    await event.save();

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all events for the current user
router.get("/", tokenVerification, async (req, res) => {
  try {
    const userId = req.user._id;
    const events = await Event.find({ user: userId }).select("-user"); // Exclude the 'user' field, if desired

    res.status(200).json({ data: events }); // Include the 'data' key for consistency
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get one event for the current user
router.get("/:eventId", tokenVerification, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const event = await Event.findOne({ _id: eventId, user: userId });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update an existing event
router.put("/:eventId", tokenVerification, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const { error } = validateEvent(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const event = await Event.findOne({ _id: eventId, user: userId });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    event.title = req.body.title;
    event.description = req.body.description;
    event.start = req.body.start;
    event.end = req.body.end;
    event.color = req.body.color;

    await event.save();

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete an event
router.delete("/:eventId", tokenVerification, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const event = await Event.findOne({ _id: eventId, user: userId });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    await Event.deleteOne({ _id: eventId });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
