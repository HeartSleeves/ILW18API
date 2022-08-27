const { ObjectId } = require("mongoose").Types;
const { Thought, User } = require("../models");

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then(async (thoughts) =>
        !thoughts
          ? res.status(404).json({ message: "Head empty" })
          : res.json({ thoughts })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      //   .select("-__v")
      .then(async (thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json({
              thought,
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new thought
  // ADD THOUGHT TO USER
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "Bimbo life" })
          : User.findOneAndUpdate(
              { _id: req.body.userId },
              { $addToSet: { thoughts: thought } },
              { runValidators: true, new: true }
            ).then(res.json({ message: "💡" }))
      )
      .catch((err) => res.status(500).json(err));
  },
  // update a thought
  putThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body)
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "Head empty" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Delete a thought and remove them from users
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "Head empty" })
          : User.findOneAndUpdate(
              { username: thought.username },
              { $pull: { thoughts: req.params.thoughtId } }
            ).then(res.json({ message: "Head emptied" }))
      )
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Add an reaction to a thought
  addReaction(req, res) {
    console.log("You are adding a reaction");
    console.log(req.body);
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "No thought found with that ID :(" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove reaction from a thought
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reaction: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "No thought found with that ID :(" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
