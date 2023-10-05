## `Array.reduce` Method in TypeScript

The `Array.reduce` method applies a function to each element of the array, reducing it to a single value. It takes a callback function and an optional initial value, and it accumulates the result by applying the callback function to each element.

### Syntax:

```typescript
array.reduce(
  callbackFunction: (accumulator: T, currentValue: T, index: number) => T,
  initialValue?: T
): T;
```

- `array`: The array you want to reduce.

- `callbackFunction`: A function that gets called for each element in the array. It takes up to four parameters:

  - `accumulator`: The accumulated value.

  - `currentValue`: The current element being processed.

  - `index`: The index of the current element.

- `initialValue` (optional): The initial value of the accumulator. If provided, the accumulator starts with this value; otherwise, it starts with the first element of the array.

- The `reduce` method returns the final accumulated result of the same type as the elements in the array.

### Example 1: Summing Numbers

```typescript
const numbers: number[] = [1, 2, 3, 4, 5];

const sum: number = numbers.reduce((accumulator: number, currentValue: number) => {
  return accumulator + currentValue;
}, 0);

console.log(sum); // 15
```

In this example, the `reduce` method is used to sum all the numbers in the `numbers` array.

### Example 2: Concatenating Strings

```typescript
const words: string[] = ["Hello", ", ", "world", "!"];

const message: string = words.reduce(
  (accumulator: string, currentValue: string) => {
    return accumulator + currentValue;
  },
  ""
);

console.log(message); // "Hello, world!"
```

In this example, `reduce` is used to concatenate all the strings in the `words` array.

### Example 3: Finding Maximum Value

```typescript
const values: number[] = [12, 45, 7, 23, 56, 14];

const max: number = values.reduce((accumulator: number, currentValue: number) => {
  return Math.max(accumulator, currentValue);
}, Number.NEGATIVE_INFINITY);

console.log(max); // 56
```

Here, `reduce` is employed to find the maximum value in the `values` array.

### Exercises:

1. Write a function that takes an array of numbers and uses `reduce` to find the product of all the numbers.

   Example:
   ```typescript
   const numbers: number[] = [2, 3, 4];
   // Output: 24
   ```

2. Create a function that accepts an array of strings and uses `reduce` to find the longest string.

   Example:
   ```typescript
   const words: string[] = ["apple", "banana", "cherry"];
   // Output: "banana"
   ```

3. Write a function that takes an array of objects representing expenses, where each object has a `category` (string) and `amount` (number), and use `reduce` to calculate the total expenses for each category.

   Example:
   ```typescript
   interface Expense {
     category: string;
     amount: number;
   }

   const expenses: Expense[] = [
     { category: "Food", amount: 50 },
     { category: "Transportation", amount: 30 },
     { category: "Food", amount: 20 },
   ];

   // Output: { Food: 70, Transportation: 30 }
   ```

