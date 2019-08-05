const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    const token = await user.generateAuthToken();

    return res.status(201).send({ user, token });
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 400)
      .send({ error: "Couldn't create user" });
  }
});

router.get("/users/me", auth, async (req, res) => {
  const { user } = req;

  return res.send(user);
});

router.patch("/users/me", auth, async (req, res) => {
  const { user } = req;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isUpdatesValid = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isUpdatesValid) {
    return res.status(400).send({ error: "Invalid user inputs" });
  }

  try {
    updates.forEach(update => (user[update] = req.body[update]));

    await user.save();

    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send({ error: "Couldn't update the user" });
  }
});

router.delete("/users/me", auth, async (req, res) => {
  const { user } = req;

  try {
    await user.remove();

    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send({ error: "Couldn't delete user" });
  }
});

router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);

    const token = await user.generateAuthToken();

    return res.status(200).send({ user, token });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Couldn't login" });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  const { token: activeToken, user } = req;

  try {
    user.tokens = user.tokens.filter(token => token.token !== activeToken);

    await user.save();

    return res.status(200).send();
  } catch (err) {
    return res.status(400).send({ error: "Couldn't logout" });
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  const { user } = req;

  try {
    user.tokens = [];

    await user.save();

    return res.status(200).send();
  } catch (err) {
    return res.status(400).send({ error: "Couldn't logout all" });
  }
});

module.exports = router;