const mongoose = require("mongoose");
const Joi = require("joi");

const eventSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String, required: true },
  description: { type: String, required: false },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  color: { type: String, required: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Event = mongoose.model("Event", eventSchema);

const validateEvent = (data) => {
  const schema = Joi.object({
    title: Joi.string().required().label("Title"),
    description: Joi.string().allow("").optional().label("Description"),
    start: Joi.date().required().label("Start"),
    end: Joi.date().required().label("End"),
    color: Joi.string().optional().label("Color"),
  });

  return schema.validate(data);
};

module.exports = { Event, validateEvent };
