const express = require('express');
const path = require('path');

const dataBase = require('./db/db.json');

const app = express();
const PORT = 3001;

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req,res) => res.json(dataBase));

app.post('/api/notes', (req,res) => {res
  res.json(`${req.method} request recieved to add a note`);

  console.info(`${req.method} request received to add a note`);
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);