import { name, add } from './utils';
import { getNotes } from './notes';
import chalk from 'chalk';
import yargs from 'yargs';
import fs from 'fs';

yargs.version('1.1.0');

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
  handler: function(argv) {
    console.log('Adding new note:');
    console.log(chalk.bold('Title:') + argv.title);
    console.log(chalk.bold('Body:') + argv.body);
    console.log(chalk.bold('Author:') + argv.author);
  },
});

yargs.command({
  command: 'remove',
  describe: 'remove a note',
  handler: function() {
    console.log('Removing a note');
  },
});

// Create add command
yargs.command({
  command: 'list',
  describe: 'list existing notes',
  handler: function(argv) {
    console.log(chalk.blue(`Listing notes`));
  },
});

yargs.command({
  command: 'read',
  describe: 'read a note',
  handler: function() {
    console.log('Reading notes');
  },
});

yargs.parse();

const obj = {
  name: 'Alberto',
  friends: ['Luis', 'Jorge', 'Maria'],
};

const str = JSON.stringify(obj);
console.log(str);

const obj2 = JSON.parse(str);
console.log(obj2);

fs.writeFileSync('notes.txt', str);
const obj3 = JSON.parse(fs.readFileSync('notes.txt').toString());

console.log(obj3);
