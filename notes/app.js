const validator = require("validator");
const { getNotes, removeNote, addNote } = require("./notes");
const yargs = require("yargs");

// Create add command
yargs.command({
  command: "add",
  describe: "Add new note",
  builder: {
    title: {
      describe: "Note title",
      demandOption: true,
      type: "string"
    },
    body: {
      describe: "Note body",
      demandOption: true,
      type: "string"
    }
  },
  handler: ({ title, body }) => {
    addNote(title, body);
  }
});

// Create remove command
yargs.command({
  command: "remove",
  describe: "Remove note",
  title: {
    describe: "Note title",
    demandOption: true,
    type: "string"
  },
  handler: ({ title }) => {
    removeNote(title);
  }
});

// Create list command
yargs.command({
  command: "list",
  describe: "List notes",
  handler: () => {
    getNotes();
  }
});

// Create read command
yargs.command({
  command: "read",
  describe: "Read a note",
  handler: () => {
    console.log("Note readed");
  }
});

console.log(yargs.argv);
