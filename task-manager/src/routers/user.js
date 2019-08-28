const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

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

router.get("/users/:id/avatar", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user || !user.avatar) {
      return res.status(404).send({ error: "User avatar found" });
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (err) {
    return res.status(404).send({ error: "Couldn't get avatar" });
  }
});

router.use(auth);

router.post("/users/logout", async (req, res) => {
  const { token: activeToken, user } = req;

  try {
    user.tokens = user.tokens.filter(token => token.token !== activeToken);

    await user.save();

    return res.status(200).send();
  } catch (err) {
    return res.status(400).send({ error: "Couldn't logout" });
  }
});

router.post("/users/logoutAll", async (req, res) => {
  const { user } = req;

  try {
    user.tokens = [];

    await user.save();

    return res.status(200).send();
  } catch (err) {
    return res.status(400).send({ error: "Couldn't logout all" });
  }
});

const upload = multer({
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a image"));
    }

    return cb(undefined, true);
  }
});

router.post("/users/me/avatar", upload.single("avatar"), async (req, res) => {
  const { user, file } = req;
  try {
    const buffer = await sharp(file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    user.avatar = buffer;

    await user.save();
    res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Failed avatar upload" });
  }
});

router.delete("/users/me/avatar", async (req, res) => {
  const { user } = req;
  try {
    user.avatar = undefined;

    await user.save();

    return res.status(200).send();
  } catch (err) {
    return res.status(400).send({ error: "Error deleting avatar" });
  }
});

module.exports = router;
