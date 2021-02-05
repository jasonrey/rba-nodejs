const mongoose = require('mongoose');
const express = require('express');

const app = express();
const client = mongoose.connect(
  `mongodb://localhost:27017/${process.env.DB_NAME || 'rba'}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const PORT = process.env.PORT || 3000;

const Task = mongoose.model('task', {
  title: {
    type: String,
    required: true,
  },
});

app.get('/task/:id', async (req, res) => {
  await client;

  const task = await Task.findOne({
    _id: req.params.id,
  });

  res.json(task);
});

app.post('/task', express.json(), async (req, res) => {
  await client;

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

app.put('/task/:id', express.json(), async (req, res) => {
  await client;

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

app.delete('/task/:id', async (req, res) => {
  await client;

  await Task.deleteOne({
    _id: req.params.id,
  });

  res.json({
    state: true,
  });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
