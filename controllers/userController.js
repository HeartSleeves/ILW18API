const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

// // Aggregate function to get the number of users overall
// const headCount = async () =>
//   User.aggregate()
//     .count("userCount")
//     .then((numberOfUsers) => numberOfUsers);

// // Aggregate function for getting the overall grade using $avg
// const grade = async (userId) =>
//   User.aggregate([
//     // only include the given user by using $match
//     { $match: { _id: ObjectId(userId) } },
//     {
//       $unwind: "$friends",
//     },
//     {
//       $group: {
//         _id: ObjectId(userId),
//         overallGrade: { $avg: "$friends.score" },
//       },
//     },
//   ]);

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) =>
        !users
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json({
              users,
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      // .select("-__v")
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json({
              user,
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // update a user
  putUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body)
      .then((user) =>
        !user
          ? res.status(404).json({ message: "User not found" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user and remove them from friend lists
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then(
        (user) =>
          !user
            ? res.status(404).json({ message: "No such user exists" })
            : res.json({ message: "User deleted" }),
        Thought.deleteMany({ username: req.params.username }),
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { friends: req.params.friendId } },
          { runValidators: true, new: true }
        )
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add an friend to a user
  addFriend(req, res) {
    console.log("You are adding a friend");
    console.log(req.params.friendId);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove friend from a user
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
