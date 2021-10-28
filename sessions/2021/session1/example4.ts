// Write a function min that takes two arguments and returns their minimum.

// arrow function
const min = (a: number, b: number): number => {
  if (a < b) return a;
  return b;
};

// function to variable
const min2 = function (a: number, b: number): number {
  if (a < b) return a;
  return b;
};

// function
function min3(a: number, b: number): number {
  if (a < b) return a;
  return b;
}
