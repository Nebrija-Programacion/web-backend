// Define a recursive function isEven.
// The function should accept a single parameter (a positive, whole number) and return a Boolean.

const isEven = (num: number): boolean => {
  if (num < 0) throw new Error("Invalid value");
  else if (num === 1) return false;
  else if (num === 0) return true;
  else return isEven(num - 2);
};

console.log(`33 is Even: ${isEven(33)}`);
console.log(`42 is Even: ${isEven(42)}`);
console.log(`-5 is Even: ${isEven(-5)}`);
