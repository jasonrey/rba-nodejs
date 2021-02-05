const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');

const app = express();
const client = new MongoClient(
  process.env.MONGO_HOST || 'mongodb://127.0.0.1:27017',
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const dbConnection = client.connect();
const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || 'rba';
const TASK_COLLECTION = process.env.TASK_COLLECTION || 'tasks';

app.get('/task/:id', async (req, res) => {
  await dbConnection;

  const row = await client
    .db(DB_NAME)
    .collection(TASK_COLLECTION)
    .findOne({
      _id: ObjectId(req.params.id),
    });

  res.json(row);
});

app.post('/task', express.json(), async (req, res) => {
  await dbConnection;

  const result = await client
    .db(DB_NAME)
    .collection(TASK_COLLECTION)
    .insertOne({
      title: req.body.title,
    });

  res.json({
    id: result.insertedId,
  });
});

app.put('/task/:id', express.json(), async (req, res) => {
  await dbConnection;

  await client
    .db(DB_NAME)
    .collection(TASK_COLLECTION)
    .updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          title: req.body.title,
        },
      }
    );

  res.json({
    id: req.params.id,
  });
});

app.delete('/task/:id', async (req, res) => {
  await dbConnection;

  await client
    .db(DB_NAME)
    .collection(TASK_COLLECTION)
    .deleteOne({
      _id: ObjectId(req.params.id),
    });

  res.json({
    state: true,
  });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
