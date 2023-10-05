## `Array.some` Method in TypeScript

The `Array.some` method is a built-in function in TypeScript that allows you to determine whether at least one element in an array satisfies a given condition. It returns `true` if at least one element meets the condition, otherwise, it returns `false`.

### Syntax:

```typescript
array.some(callbackFunction: (currentValue: T, index: number) => boolean): boolean;
```

- `array`: The array you want to check for the condition.

- `callbackFunction`: A function that gets called for each element in the array. It takes up to three parameters:

  - `currentValue`: The current element being processed.

  - `index`: The index of the current element.


- The `some` method returns `true` if at least one element in the array satisfies the condition, or `false` if none of the elements match.

### Example:

```typescript
const numbers: number[] = [1, 2, 3, 4, 5];

const hasEvenNumber: boolean = numbers.some((num: number) => {
  return num % 2 === 0;
});

console.log(hasEvenNumber); // true
```

In this example, the `some` method is used to check if there is at least one even number in the `numbers` array, and it returns `true`.

### Exercises:

1. Write a function that takes an array of numbers and uses `some` to determine if at least one number is negative.

   Example:
   ```typescript
   const numbers: number[] = [5, 8, -2, 7, 15];
   // Output: true
   ```

2. Create a function that accepts an array of objects representing students and uses `some` to check if at least one student has a passing grade (assuming each object has a `grade` property).

   Example:
   ```typescript
   interface Student {
     name: string;
     grade: number;
   }

   const students: Student[] = [
     { name: "Alice", grade: 85 },
     { name: "Bob", grade: 70 },
     { name: "Charlie", grade: 60 },
   ];

   // Output: true
   ```

3. Write a function that takes an array of strings and uses `some` to determine if at least one string has more than 10 characters.

   Example:
   ```typescript
   const words: string[] = ["apple", "banana", "cherry"];
   // Output: true
   ```

