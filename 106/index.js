const fs = require('fs').promises;
const express = require('express');
const app = express();

let port = 3000;

for (let i = 2; i < process.argv.length; i++) {
  const [key, value] = process.argv[i].split('=');

  switch (key) {
    case '--port':
      port = value;
      break;
  }
}

app.get('/user', (req, res) => {
  res.json({
    name: req.query.name,
    age: req.query.age,
    gender: req.query.gender,
  });
});

app.post('/user', express.json(), async (req, res) => {
  await fs.writeFile(
    'user.json',
    JSON.stringify({
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
    })
  );

  res.json({
    state: true,
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
