// packages installed

const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// express app configured to port 3000
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// static files added to get rdata from public dir
// https://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, "public")));

// routing
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// retrieve all note characters
// https://expressjs.com/en/guide/routing.html
app.get("/api/notes", (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
    res.send(data);
  } catch (err) {
    console.error(err);
  }
});

// deafault route added
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// new note building - body parsing middleware
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  try {
    //   preData before processing
    let preData = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
    let noteArray = JSON.parse(preData);
    let uuid = uuidv4();
    noteArray.push(newNote);

    const dataBaseFile = path.join(__dirname, "/db/db.json");
    fs.writeFileSync(dataBaseFile, JSON.stringify(noteArray));
    res.json(newNote);
  } catch (err) {
    console.error(err);
  }
});

// delete note functionality
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  let preData = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
  let noteArray = JSON.parse(preData);
  if (noteArray.length > 0) {
    // .some method to match id
    const search = noteArray.some((note) => note.id === id);
    if (search) {
      newNoteArray = noteArray.filter((note) => note.id !== id);
      const dataBaseFile = path.join(__dirname, "/db/db.json");
      fs.writeFileSync(dataBaseFile, JSON.stringify(newNoteArray));
      console.log(`Delete Note`);
      res.json(newNoteArray);
    } else {
      console.log(`Note Not Found`);
      res.json(`Note Not Found`);
    }
  } else {
    console.log(`No Data Stored`);
    res.json(`No Data Stored`);
  }
});

// server init display listening port
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
