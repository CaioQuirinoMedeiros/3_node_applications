const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    const userCreated = await user.save();
    return res.status(201).send(userCreated);
  } catch (err) {
    return res.status(400).send({ error: "Error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).send(users);
  } catch (err) {
    return res.status(400).send({ error: "Error" });
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send({ error: "Error" });
  }
});

app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    const taskCreated = await task.save();
    return res.status(201).send(taskCreated);
  } catch (err) {
    return res.status(400).send({ error: "Error" });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    return res.status(200).send(tasks);
  } catch (err) {
    return res.status(400).send({ error: "Error" });
  }
});

app.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findById(id);

    return res.status(200).send(task);
  } catch (err) {
    return res.status(400).send({ error: "Error" });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
