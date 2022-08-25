const { Schema, model } = require("mongoose");
const friendSchema = require("./Friend");
const thoughtSchema = require("./Thought");

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      max_length: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max_length: 50,
    },
    thoughts: [thoughtSchema],
    friends: [
      userSchema,
      //where friends
    ],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

//TODO create virtual friend count
// userSchema.virtual('friendCount').get(function() {return `${friendSchema.}`})

const User = model("user", userSchema);

module.exports = User;
