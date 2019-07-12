const fs = require("fs");
const chalk = require("chalk");

const getNotes = () => {
  const notes = loadNotes();

  if (!notes.length) {
    console.log(chalk.red.inverse("You don't have any notes"));
    return;
  }

  notes.forEach(note => {
    console.log(chalk.yellow("-------------------------"));
    console.log(chalk.blue.inverse("Title: "), chalk.blue(note.title));
    console.log("");
    console.log(chalk.blue.inverse("Body: "), chalk.blue(note.body));
    console.log("");
  });
};

const addNote = (title, body) => {
  const notes = loadNotes();

  if (noteExists(title)) {
    console.log(chalk.red.inverse("Note title taken!"));
    return;
  }

  notes.push({ title, body });

  saveNotes(notes);
  console.log(chalk.green.inverse("New note added"));
};

const removeNote = title => {
  let notes = loadNotes();

  if (!noteExists(title)) {
    console.log(chalk.red.inverse("Note not found"));
    return;
  }

  notes = notes.filter(note => note.title !== title);

  saveNotes(notes);
  console.log(chalk.green.inverse("Note removed!"));
};

const noteExists = title => {
  const notes = loadNotes();

  const titles = notes.map(note => note.title);

  return titles.includes(title);
};

const saveNotes = notes => {
  const notesJSON = JSON.stringify(notes);

  fs.writeFile("notes.json", notesJSON, () => {});
};

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync("notes.json");

    const dataJSON = dataBuffer.toString();

    return JSON.parse(dataJSON);
  } catch (err) {
    return [];
  }
};

module.exports = { getNotes, addNote, removeNote };
