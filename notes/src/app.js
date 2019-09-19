import { name, add } from './utils';
import { getNotes } from './notes';
import validator from 'validator';
import chalk from 'chalk';
console.log(name);
console.log(add(3, 4));
const msg = getNotes();
console.log(msg);

const isMail = validator.isEmail('alberto.valero@bq.com');
console.log(isMail);

console.log(chalk.blue('Hola mundo'));
console.log(chalk.blue.bgRed.bold('Hello world!'));
