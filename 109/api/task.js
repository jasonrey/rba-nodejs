const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const db = require('../utils/db');

const Task = mongoose.model('task', {
  title: {
    type: String,
    required: true,
  },
});

router.get('/task/:id', async (req, res) => {
  await db;

  const task = await Task.findOne({
    _id: req.params.id,
  });

  res.json(task);
});

router.post('/task', express.json(), async (req, res) => {
  await db;

  const task = new Task({
    title: req.body.title,
  });

  try {
    await task.save();
  } catch (err) {
    return res.status(400).send(err.message);
  }

  res.json({
    id: task._id,
  });
});

router.put('/task/:id', express.json(), async (req, res) => {
  await db;

  const task = await Task.findOne({
    _id: req.params.id,
  });

  if (!task) {
    return res.status(400).send('Item not found');
  }

  task.title = req.body.title;

  try {
    await task.save();
  } catch (err) {
    return res.status(400).send(err.message);
  }

  res.json({
    id: task._id,
  });
});

router.delete('/task/:id', async (req, res) => {
  await db;

  await Task.deleteOne({
    _id: req.params.id,
  });

  res.json({
    state: true,
  });
});

module.exports = router;
