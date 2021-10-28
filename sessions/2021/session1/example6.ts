// You can get the Nth character, or letter, from a string by writing "string"[N].
// The returned value will be a string containing only one character (for example, "b").
// The first character has position 0, which causes the last one to be found at position string.length - 1.
// In other words, a two-character string has length 2, and its characters have positions 0 and 1.

// Write a function called countChar.
// It takes a second argument that indicates the character that is to be counted
// and return the number of occurreces

const countChar = (str: string, c: string) => {
  let count: number = 0;
  let i: number = 0;
  while (i < str.length) {
    if (str[i] === c) count++;
    i++;
  }

  return count;
};

console.log(countChar("parras", "a"));
