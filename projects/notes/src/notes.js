import format from 'date-format';
import uuid from 'uuid';

const add = (obj, note) => {
  obj.lastUpdate = format.asString('dd-MM-yyyy hh:mm', new Date());
  const n = {
    uuid: uuid.v4(),
    title: note.title,
    body: note.body,
    author: note.author,
  };

  obj.notes.push(n);

  console.log('Note added');
};

const read = (obj, id) => {
  const note = obj.notes.find(n => n.uuid === id);
  if (note) {
    console.log(`${note.title}`);
    console.log(`${note.body}`);
    console.log(`Author: ${note.author}`);
  } else {
    console.log('Unknown note');
  }
};

const list = obj => {
  obj.notes.forEach((note, index) => {
    console.log(`${index}.- ${note.title} - ${note.uuid}`);
  });

  console.log(`Notes last update on ${obj.lastUpdate}`);
};

const remove = (obj, id) => {
  obj.notes = obj.notes.filter(note => note.uuid !== id);
  obj.lastUpdate = format.asString('dd-MM-yyyy hh:mm', new Date());
  console.log('Note deleted');
};

export { add, read, list, remove };
