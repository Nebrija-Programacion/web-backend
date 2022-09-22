const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// console.log all elements in the array
arr.forEach((element) => {
  console.log(element);
});

// filter only even numbers
const even: number[] = arr.filter((element) => {
  return element % 2 === 0;
});

// check if there is a number greater than 5
const greaterThan5: boolean = arr.some((element) => {
  return element > 5;
});

// check if all numbers are greater than 0
const allGreaterThan0: boolean = arr.every((element) => {
  return element > 0;
});

// sum all numbers
const sum: number = arr.reduce((acc, element) => {
  return acc + element;
});

// find the first number greater than 5
const firstGreaterThan5: number | undefined = arr.find((element) => {
  return element > 5;
});

// build a new array with all numbers doubled
const doubled: number[] = arr.map((element) => {
  return element * 2;
});

// reverse array
const reversed: number[] = arr.reduce((acc: number[], element) => {
  return [element, ...acc];
}, []);
