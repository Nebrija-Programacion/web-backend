const arr: number[] = [2, 33, 4, 3, 2, 3, 44, 3, 22, 33];
const arr2: number[][] = [
  [3, 6, 5],
  [7, 7, 8],
  [9, 6, 11, 8],
];

// remove all duplicates from the array
const unique: number[] = arr.reduce((acc: number[], element) => {
  if (!acc.includes(element)) {
    acc.push(element);
  }
  return acc;
}, []);

// find the largest number in the array
const largest: number = arr.reduce((acc: number, element) => {
  if (element > acc) {
    acc = element;
  }
  return acc;
}, arr[0]);

// find the smallest number in the array
const smallest: number = arr.reduce((acc: number, element) => {
  if (element < acc) {
    acc = element;
  }
  return acc;
}, arr[0]);

// find the average of all numbers in the array
const average: number =
  arr.reduce((acc: number, element) => {
    return acc + element;
  }, 0) / arr.length;

// find the median of all numbers in the array
const median: number = arr.sort((a, b) => a - b)[Math.floor(arr.length / 2)];

// make linear array of arr2
const linear: number[] = arr2.reduce((acc: number[], element) => {
  return [...acc, ...element];
}, []);

// find maximum of arr2
const max: number = arr2.reduce((acc: number, element) => {
  const localmax = element.reduce((acc: number, element) => {
    if (element > acc) {
      acc = element;
    }
    return acc;
  }, element[0]);

  if (localmax > acc) {
    acc = localmax;
  }
  return acc;
}, arr2[0][0]);
