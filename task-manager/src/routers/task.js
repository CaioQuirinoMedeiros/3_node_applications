const express = require("express");
const router = new express.Router();
const Task = require("../models/task");

router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    const taskCreated = await task.save();

    return res.status(201).send(taskCreated);
  } catch (err) {
    return res.status(400).send({ error: "Couldn't create task" });
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    return res.status(200).send(tasks);
  } catch (err) {
    return res.status(500).send({ error: "Couldn't get tasks" });
  }
});

router.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    return res.status(200).send(task);
  } catch (err) {
    return res.status(400).send({ error: "Couldn't get the task" });
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isUpdatesValid = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isUpdatesValid) {
    return res.status(400).send({ error: "Invalid task inputs" });
  }

  try {
    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    return res.status(200).send(task);
  } catch (err) {
    return res.status(400).send({ error: "Couldn't update the task" });
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    return res.status(200).send(task);
  } catch (err) {
    return res.status(400).send({ error: "Couldn't delete task" });
  }
});

module.exports = router;
