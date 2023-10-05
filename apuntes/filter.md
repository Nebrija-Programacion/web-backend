## `Array.filter` Method in TypeScript

The `Array.filter` method is a built-in function in TypeScript that allows you to create a new array containing all elements from the original array that satisfy a given condition. It returns a new array with only the elements that meet the condition.

### Syntax:

```typescript
array.filter(callbackFunction: (element: T, index: number) => boolean): T[];
```

- `array`: The array you want to filter.

- `callbackFunction`: A function that gets called for each element in the array. It takes up to three parameters:

  - `element`: The current element being processed.

  - `index`: The index of the current element.

- The `filter` method returns a new array of type `T[]` containing only the elements that satisfy the condition.

### Example:

```typescript
const numbers: number[] = [1, 2, 3, 4, 5];

const evenNumbers: number[] = numbers.filter((num: number) => {
  return num % 2 === 0;
});

console.log(evenNumbers); // [2, 4]
```

In this example, the `filter` method is used to create a new array `evenNumbers`, which contains only the even numbers from the `numbers` array.

### Exercises:

1. Write a function that takes an array of numbers and uses `filter` to create a new array containing only the positive numbers.

   Example:
   ```typescript
   const numbers: number[] = [-2, 5, -7, 10, 3];
   // Output: [5, 10, 3]
   ```

2. Create a function that accepts an array of objects representing books (each object has a `title` and `author` property) and uses `filter` to find all books by a specific author.

   Example:
   ```typescript
   interface Book {
     title: string;
     author: string;
   }

   const books: Book[] = [
     { title: "Harry Potter", author: "J.K. Rowling" },
     { title: "The Hobbit", author: "J.R.R. Tolkien" },
     { title: "The Catcher in the Rye", author: "J.D. Salinger" },
   ];

   // Find all books by "J.R.R. Tolkien"
   // Output: [{ title: "The Hobbit", author: "J.R.R. Tolkien" }]
   ```

3. Write a function that takes an array of strings and uses `filter` to create a new array containing only the strings with more than 5 characters.

   Example:
   ```typescript
   const words: string[] = ["apple", "banana", "cherry", "date", "fig"];
   // Output: ["banana", "cherry"]
   ```

