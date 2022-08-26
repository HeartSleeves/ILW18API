const connection = require("../config/connection");
const { User, Thought } = require("../models");
const {
  getRandomName,
  getRandomArrItem,
  getRandomReaction,
} = require("./data");
// const {ObjectId} = require("mongoose").Types;

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  // Drop existing Thoughts
  await Thought.deleteMany({});

  // Drop existing users
  await User.deleteMany({});

  // Create empty array to hold the users
  const users = [];
  const usednames = [];
  const friends = [];
  const thoughtsarr = [];

  // Loop 20 times -- add users to the user array
  for (let i = 0; i < 20; i++) {
    // Get some random assignment objects using a helper function that we imported from ./data
    let username = getRandomName();
    if (usednames.includes(username)) {
      const num = Math.floor(Math.random() * 90 + 10);
      username = username + num;
      usednames.push({ username });
    }
    const email = `${username}@gmail.com`;
    let thoughts = [];
    users.push({
      username,
      email,
      thoughts,
      friends,
    });
    usednames.push(username);
  }
  // Add users to the collection and await the results
  await User.collection.insertMany(users);
  // console.log("postcreation", users);

  // Add users as friends
  for (let i = 0; i < users.length; i++) {
    // console.log("making friend");
    const friend = users[i];
    const friendid = friend._id.toString();
    // console.log("friendid", friendid);

    // console.log("friend", friend);
    const newfriends = [];
    for (let i = 0; i < 6; i++) {
      const newFriendObject = getRandomArrItem(users);
      // console.log("newFriendObject", newFriendObject);
      const newFriendId = newFriendObject._id;
      // console.log("newFriendId", newFriendId);
      const newfriend = newFriendId.toString();
      // console.log(newfriend);
      newfriends.push({ _id: newfriend });
    }
    users[i].friends = newfriends;
    const filter = { _id: users[i]._id };
    const update = { friends: newfriends };
    await User.findOneAndUpdate(filter, update);
  }

  // Add reactions to the collection and await the results
  const reactionsarr = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const username = user.username;
    const reactionBody = getRandomReaction();
    // const reactionId = function () {
    //   new ObjectId();
    // };
    reactionsarr.push({
      // reactionId,
      reactionBody,
      username,
    });
  }
  // await Reaction.collection.insertMany(reactionsarr);
  // console.log("reactionsarr", reactionsarr[1]);

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const username = user.username;
    const thoughtText = getRandomReaction();
    const reactions = [];
    for (let i = 0; i < 2; i++) {
      const reaction = getRandomArrItem(reactionsarr);
      reactions.push(reaction);

      thoughtsarr.push({
        thoughtText,
        username,
        reactions,
      });
    }
  }
  await Thought.collection.insertMany(thoughtsarr);
  // console.log("thoughts.length", thoughts.length);

  // Add thoughts to Users;
  for (let i = 0; i < users.length; i++) {
    const user = users[i].username;
    // for (let i = 0; i < thoughts.length; i++) {
    //   const thought = thoughts[i];

    // }
    function findUsername(thought) {
      return thought.username === user;
    }
    const results = thoughtsarr.filter(findUsername);
    // console.log("result", result);
    const newThought = [];
    function getId(obj) {
      let data = obj._id;
      let objectid = data.toString();
      let object = { _id: objectid };
      newThought.push(object);
    }
    const thoughtIds = results.forEach(getId);
    const thoughtuser = results[0].username;
    console.log("thoughtuser", thoughtuser);
    console.log("thoughtId", newThought);
    users[i].thoughts = newThought;
    const filter = { username: thoughtuser };
    const update = { thoughts: newThought };
    // console.log(user);
    // console.log(thoughtId);
    await User.findOneAndUpdate(filter, update);
  }

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.log(users[0].thoughts);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
