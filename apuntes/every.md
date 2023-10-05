## `Array.every` Method in TypeScript

The `Array.every` method is a built-in function in TypeScript that allows you to determine whether all elements in an array satisfy a given condition. It returns `true` if all elements meet the condition, otherwise, it returns `false`.

### Syntax:

```typescript
array.every(callbackFunction: (currentValue: T, index: number) => boolean): boolean;
```

- `array`: The array you want to check for the condition.

- `callbackFunction`: A function that gets called for each element in the array. It takes up to three parameters:

  - `currentValue`: The current element being processed.

  - `index`: The index of the current element.

- The `every` method returns `true` if all elements in the array satisfy the condition, or `false` if any element fails to meet the condition.

### Example:

```typescript
const numbers: number[] = [2, 4, 6, 8, 10];

const allEven: boolean = numbers.every((num: number) => {
  return num % 2 === 0;
});

console.log(allEven); // true
```

In this example, the `every` method is used to check if all numbers in the `numbers` array are even, and it returns `true`.

### Exercises:

1. Write a function that takes an array of numbers and uses `every` to determine if all numbers are positive.

   Example:
   ```typescript
   const numbers: number[] = [5, 8, 2, 7, 15];
   // Output: true
   ```

2. Create a function that accepts an array of objects representing students and uses `every` to check if all students have passing grades (assuming each object has a `grade` property).

   Example:
   ```typescript
   type Student = {
     name: string;
     grade: number;
   }

   const students: Student[] = [
     { name: "Alice", grade: 85 },
     { name: "Bob", grade: 70 },
     { name: "Charlie", grade: 60 },
   ];

   // Output: false
   ```

3. Write a function that takes an array of strings and uses `every` to determine if all strings have at least 5 characters.

   Example:
   ```typescript
   const words: string[] = ["apple", "banana", "cherry"];
   // Output: true
   ```

