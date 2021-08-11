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

// routing
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// retrieve all note characters
app.get("/api/notes", (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
    res.json(data);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// new note building - body parsing middleware
app.post("/api/notes", (req, res) => {
  const newNote = req.body;

  try {
    //   preData before processing
    let preData = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
    let noteArray = JSON.parse(preData);
    console.log(noteArray);
    noteArray.push(newNote);
    console.log(newNote);

    
    const dataBaseFile = path.join(__dirname, "/db/db.json");
    fs.writeFileSync(dataBaseFile, JSON.stringify(noteArray));
    res.json(noteArray);
  } catch (err) {
    console.error(err);
  }

//   changes to be pushed into array
});

// server init
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
