const express = require('express');
const Task = require('../models/task');
const router = express.Router();

router.get('/task/:id', async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
  });

  res.json(task);
});

router.post('/task', express.json(), async (req, res) => {
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
  await Task.deleteOne({
    _id: req.params.id,
  });

  res.json({
    state: true,
  });
});

module.exports = router;
