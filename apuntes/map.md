## `Array.map` Method in TypeScript

The `Array.map` method is a built-in function in TypeScript that allows you to create a new array by applying a transformation function to each element of an existing array. It returns a new array with the same length as the original array, where each element is the result of applying the provided function to the corresponding element in the original array.

### Syntax:

```typescript
array.map(callbackFunction: (currentValue: T, index: number) => U): U[];
```

- `array`: The array you want to iterate over.

- `callbackFunction`: A function that gets called for each element in the array. It takes up to three parameters:

  - `currentValue`: The current element being processed.

  - `index`: The index of the current element.

- The `map` method returns a new array of type `U[]` where `U` is the type returned by the `callbackFunction`.

### Example:

```typescript
const numbers: number[] = [1, 2, 3, 4, 5];

const squaredNumbers: number[] = numbers.map((num: number) => {
  return num * num;
});

console.log(squaredNumbers); // [1, 4, 9, 16, 25]
```

In this example, the `map` method is used to create a new array `squaredNumbers`, where each element is the square of the corresponding element in the `numbers` array.

### Exercises:

1. Write a function that takes an array of temperatures in Celsius and uses `map` to convert each temperature to Fahrenheit using the formula: `Fahrenheit = (Celsius * 9/5) + 32`.

   Example:
   ```typescript
   const celsiusTemperatures: number[] = [0, 25, 100];
   // Output: [32, 77, 212]
   ```

2. Create a function that accepts an array of strings and uses `map` to capitalize the first letter of each string.

   Example:
   ```typescript
   const words: string[] = ["apple", "banana", "cherry"];
   // Output: ["Apple", "Banana", "Cherry"]
   ```

3. Write a function that takes an array of objects representing people and uses `map` to create a new array of their full names (assuming each object has `firstName` and `lastName` properties).

   Example:
   ```typescript
   const people: { firstName: string; lastName: string }[] = [
     { firstName: "Alice", lastName: "Johnson" },
     { firstName: "Bob", lastName: "Smith" },
   ];
   // Output: ["Alice Johnson", "Bob Smith"]
   ```

