## `Array.forEach` Method in TypeScript

The `Array.forEach` method is a built-in function in TypeScript that allows you to iterate over the elements of an array and perform a specified operation on each element. It's a convenient way to loop through an array without the need for a traditional `for` loop.

### Syntax:

```typescript
array.forEach(callbackFunction: (currentValue: T, index: number) => void): void;
```

- `array`: The array you want to iterate over.

- `callbackFunction`: A function that gets called for each element in the array. It can take up to three parameters:

  - `currentValue`: The current element being processed.

  - `index`: The index of the current element.
  
### Example:

```typescript
const numbers: number[] = [1, 2, 3, 4, 5];

numbers.forEach((num: number) => {
  console.log(num);
});
```

In this example, the `forEach` method is used to iterate over the `numbers` array, and for each element, it logs the element to the console.

### Exercises:

1. Write a function that takes an array of names and uses `forEach` to print "Hello, [name]!" for each name in the array.

   Example:
   ```typescript
   const names: string[] = ["Alice", "Bob", "Charlie"];
   // Output:
   // Hello, Alice!
   // Hello, Bob!
   // Hello, Charlie!
   ```

2. Create a function that accepts an array of numbers and uses `forEach` to calculate the sum of all the numbers in the array.

   Example:
   ```typescript
   const numbers: number[] = [1, 2, 3, 4, 5];
   // Output: 15
   ```

3. Write a function that takes an array of words and uses `forEach` to create a new array containing the lengths of each word.

   Example:
   ```typescript
   const words: string[] = ["apple", "banana", "cherry"];
   // Output: [5, 6, 6]
   ```

