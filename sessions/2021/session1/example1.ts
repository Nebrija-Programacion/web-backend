/**
 * Write a loop that makes seven calls to console.log to output the following triangle
 * #
 * ##
 * ###
 * ####
 * #####
 * ######
 * #######
 */

let line: string = "#";
for (let i: number = 1; i <= 7; i++) {
  console.log(line);
  line += "#";
}
