## `Array.find` Method in TypeScript

The `Array.find` method is a built-in function in TypeScript that allows you to find the first element in an array that satisfies a given condition. It returns the first element that matches the condition or `undefined` if no matching element is found.

### Syntax:

```typescript
array.find(callbackFunction: (currentValue: T, index: number) => boolean): T | undefined;
```

- `array`: The array you want to search.

- `callbackFunction`: A function that gets called for each element in the array. It takes up to three parameters:

  - `currentValue`: The current element being processed.

  - `index`: The index of the current element.

- The `find` method returns the first element of type `T` that satisfies the condition, or `undefined` if no matching element is found.

### Example:

```typescript
const numbers: number[] = [1, 2, 3, 4, 5];

const evenNumber: number | undefined = numbers.find((num: number) => {
  return num % 2 === 0;
});

console.log(evenNumber); // 2
```

In this example, the `find` method is used to find the first even number in the `numbers` array, and it returns `2`.

### Exercises:

1. Write a function that takes an array of strings and uses `find` to find the first string that contains the letter "a."

   Example:
   ```typescript
   const words: string[] = ["apple", "banana", "cherry"];
   // Output: "apple"
   ```

2. Create a function that accepts an array of objects representing books and uses `find` to find the first book with a specified title.

   Example:
   ```typescript
   interface Book {
     title: string;
     author: string;
   }

   const books: Book[] = [
     { title: "Harry Potter", author: "J.K. Rowling" },
     { title: "The Hobbit", author: "J.R.R. Tolkien" },
   ];

   // Find the book with the title "The Hobbit"
   // Output: { title: "The Hobbit", author: "J.R.R. Tolkien" }
   ```

3. Write a function that takes an array of numbers and uses `find` to find the first number greater than 10.

   Example:
   ```typescript
   const numbers: number[] = [5, 8, 12, 7, 15];
   // Output: 12
   ```

