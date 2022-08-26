const connection = require("../config/connection");
const { Reaction, User, Thought } = require("../models");
const { getRandomName, getRandomArrItem } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  // Drop existing reactions
  await Reaction.deleteMany({});

  // Drop existing Thoughts
  await Thought.deleteMany({});

  // Drop existing users
  await User.deleteMany({});

  // Create empty array to hold the users
  const users = [];
  const usednames = [];
  const friends = [];

  // Loop 20 times -- add users to the friends array
  for (let i = 0; i < 20; i++) {
    // Get some random assignment objects using a helper function that we imported from ./data
    // const friends = getRandomName(20);
    let username = getRandomName();
    if (usednames.includes(username)) {
      const num = Math.floor(Math.random() * 90 + 10);
      username = username + num;
      usednames.push({ username });
    }
    const email = `${username}@gmail.com`;

    users.push({
      username,
      email,
      // thoughts,
      friends,
    });
    usednames.push(username);
  }
  console.log("precreation", users);
  // Add users to the collection and await the results
  await User.collection.insertMany(users);

  // const createdUsers = User.collection.find();
  // .then(async (users) => {
  //   const userObj = {
  //     users,
  //   };
  //   return res.json(userObj);
  // })
  // .catch((err) => {
  //   console.log(err);
  //   return res.status(500).json(err);
  // });
  console.log("postcreation", users);
  for (let i = 0; i < users.length; i++) {
    console.log("making friend");
    const friend = users[i];
    const friendid = friend._id.toString();
    console.log("friendid", friendid);

    // console.log("friend", friend);
    const newfriends = [];
    for (let i = 0; i < 6; i++) {
      const newFriendObject = getRandomArrItem(users, 5);
      // console.log("newFriendObject", newFriendObject);
      const newFriendId = newFriendObject._id;
      // console.log("newFriendId", newFriendId);
      const newfriend = newFriendId.toString();
      // console.log(newfriend);
      newfriends.push({ _id: newfriend });
    }
    // console.log(newfriends);
    // await User.collection.update(
    //   { _id: friendid },
    //   {
    //     $set: {
    //       friends: newfriends,
    //     },
    //   }
    // );
    users[i].friends = newfriends;
    const filter = { _id: users[i]._id };
    const update = { friends: newfriends };
    await User.findOneAndUpdate(filter, update);
  }
  // Add reactions to the collection and await the results
  await Reaction.collection.insertOne({
    reactionName: "UCLA",
    inPerson: false,
    users: [...users],
  });

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
