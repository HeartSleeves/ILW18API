const { Schema, model, mongoose } = require("mongoose");

// Schema to create Reaction model
const reactionSchema = new Schema(
  {
    reactionId: mongoose.ObjectId,
    reactionBody: {
      type: String,
      required: true,
      max_length: 280,
    },
    username: {
      type: String,
      required: true,
      max_length: 50,
    },
    createdAt: {
      type: Date,
      // same as Thought.js
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const Reaction = model("reaction", reactionSchema);

module.exports = Reaction;
