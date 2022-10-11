const arr = [1, 2, 33, 21, 23, 22, 12, 12, 14, 43, 12];

// find the mode of all numbers in the array
const mode: number = arr.reduce((acc: number, element) => {
  const count = arr.filter((e) => e === element).length;
  if (count > acc) {
    acc = element;
  }
  return acc;
}, arr[0]);

// find the range of all numbers in the array
const range: number =
  arr.reduce((acc: number, element) => {
    if (element > acc) {
      acc = element;
    }
    return acc;
  }, arr[0]) -
  arr.reduce((acc: number, element) => {
    if (element < acc) {
      acc = element;
    }
    return acc;
  }, arr[0]);

// find the standard deviation of all numbers in the array
const standardDeviation: number = Math.sqrt(
  arr.reduce((acc: number, element) => {
    return acc + Math.pow(element - average, 2);
  }, 0) / arr.length
);
