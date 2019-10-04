import yargs from 'yargs';
import fs from 'fs';
import { add, list, read, remove } from './notes';

// Create add command
yargs.command({
  command: 'add',
  describe: 'add a new note',
  builder: {
    title: {
      describe: 'Title of the note',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'body of the note',
      demandOption: true,
      type: 'string',
    },
    author: {
      describe: 'body of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler: argv => add(obj, argv),
});

yargs.command({
  command: 'list',
  describe: 'list notes',
  handler: argv => list(obj),
});

yargs.command({
  command: 'read',
  describe: 'read a note with a given id',
  builder: {
    id: {
      describe: 'id of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler: argv => read(obj, argv.id),
});

yargs.command({
  command: 'remove',
  describe: 'remove a note with a given id',
  builder: {
    id: {
      describe: 'id of the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler: argv => remove(obj, argv.id),
});

let obj = {};
const path = './notas.txt';
fs.access(path, fs.F_OK, err => {
  if (err) {
    fs.writeFileSync('notas.txt', '');
  }

  const data = fs.readFileSync('notas.txt').toString();

  if (data !== '') {
    obj = JSON.parse(data);
  } else {
    obj = {
      notes: [],
    };
  }

  yargs.parse();

  fs.writeFileSync('notas.txt', JSON.stringify(obj));
});
