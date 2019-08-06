const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
  const { user } = req;

  const task = new Task({ ...req.body, owner: user._id });

  try {
    await task.save();

    return res.status(201).send(task);
  } catch (err) {
    return res.status(400).send({ error: "Couldn't create task" });
  }
});

router.get("/tasks", auth, async (req, res) => {
  const { user } = req;
  const { completed, limit, skip, sortBy } = req.query;
  const match = {};
  const sort = {
    completed: 1
  };

  if (completed) {
    match.completed = completed === "true";
  }

  if (sortBy) {
    const parts = sortBy.split("_");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(limit),
          skip: parseInt(skip),
          sort
        }
      })
      .execPopulate();

    return res.status(200).send(user.tasks);
  } catch (err) {
    return res.status(500).send({ error: "Couldn't get tasks" });
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const { id: _id } = req.params;
  const { user } = req;

  try {
    const task = await Task.findOne({ _id, owner: user._id });

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    await task.populate("owner").execPopulate();

    return res.status(200).send(task);
  } catch (err) {
    return res.status(400).send({ error: "Couldn't get the task" });
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const { id: _id } = req.params;
  const { user } = req;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isUpdatesValid = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isUpdatesValid) {
    return res.status(400).send({ error: "Invalid task inputs" });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id, owner: user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    return res.status(200).send(task);
  } catch (err) {
    return res.status(400).send({ error: "Couldn't update the task" });
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const { id: _id } = req.params;
  const { user } = req;

  try {
    const task = await Task.findOneAndDelete({ _id, owner: user._id });

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    return res.status(200).send(task);
  } catch (err) {
    return res.status(400).send({ error: "Couldn't delete task" });
  }
});

module.exports = router;
