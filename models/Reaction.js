const { Schema, Types } = require("mongoose");

// Schema to create Reaction model
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
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
      default: () => Date.now(),
      //format date with getter
      // same as Thought.js
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const Reaction = reactionSchema;

module.exports = Reaction;
