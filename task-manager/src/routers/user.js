const express = require("express");
const router = new express.Router();
const User = require("../models/user");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    const userCreated = await user.save();
    return res.status(201).send(userCreated);
  } catch (err) {
    return res.status(400).send({ error: "Couldn't create user" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).send(users);
  } catch (err) {
    return res.status(500).send({ error: "Couldn't get users" });
  }
});

router.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send({ error: "Couldn't get the user" });
  }
});

router.patch("/users/:id", async (req, res) => {
  const { id } = req.params;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isUpdatesValid = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isUpdatesValid) {
    return res.status(400).send({ error: "Invalid user inputs" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    updates.forEach(update => (user[update] = req.body[update]));

    await user.save();

    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send({ error: "Couldn't update the user" });
  }
});

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send({ error: "Couldn't delete user" });
  }
});

router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);

    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Couldn't login" });
  }
});

module.exports = router;
