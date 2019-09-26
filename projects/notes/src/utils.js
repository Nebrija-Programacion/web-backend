let obj;

const list = function(){
  obj.notes.forEach( (note, i) => {
    console.log(`${i}: ${note.title}`);
  })
}

const add = function(argv){
  const nota = {
    uuid: uuid.v4(),
    title: argv.title,
    body: argv.body,
    author: argv.author,
  };

  obj.notes.push(nota);
  console.log(`Added: ${nota.title}`);
}

export {list, add, obj};