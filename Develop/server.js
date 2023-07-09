const express = require('express');
const path = require('path');
const fs = require(`fs`);
const uuid = require('./helpers/uuid');

const dataBase = require('./db/db.json');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'))
  res.status(200).json(notes)
});

app.post('/api/notes', (req, res) => {

  res.json(`${req.method} request received to add a note`);
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;
    if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid()
    };
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const oldNotes = JSON.parse(data);
        oldNotes.push(newNote);
        fs.writeFile(
          './db/db.json',
          JSON.stringify(oldNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Success')
        );
      }
    });
    res.status(200);
  } else {
    res.status(500).json('Error in posting note');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  res.json(`${req.method} request received to delete note`);
  console.info(`${req.method} request received to delete note`);
  const noteId = req.params.id;
  fs.readFile('./db/db.json', 'utf-8', (err,data) => {
    if (err) {
      console.error(err);
    } else {
      const oldNotes = JSON.parse(data)
      const result = oldNotes.filter((note) => note.id !== noteId);

      fs.writeFile(
        './db/db.json',
        JSON.stringify(result, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Success')
      );
    }
  })
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);