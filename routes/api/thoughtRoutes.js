const router = require("express").Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
} = require("../../controllers/userController");

// /api/thoughts
router.route("/").get(getUsers).post(createUser);

// /api/thoughts:thoughtId/reactions
router.route("/:thoughtId/reactions").get(getSingleUser).delete(deleteUser);

module.exports = router;
