1.What is the difference between var, let, and const?

sol: var → function-scoped, hoisted, can be redeclared & reassigned
let → block-scoped, hoisted but not initialized, can be reassigned
const → block-scoped, cannot be reassigned (but object/array content can be changed)

2.What is the spread operator (...)?

sol: The spread operator (...) expands/copies elements of an array or object into a new array/object or function arguments.
Example: const newArr = [...oldArr, 4, 5]; or const merged = { ...obj1, ...obj2 };

3.What is the difference between map(), filter(), and forEach()?

sol: map() → creates a new array by transforming each element
filter() → creates a new array with only elements that pass a test
forEach() → executes a function for each element, returns nothing (undefined)


4.What is an arrow function?

sol: A shorter syntax for writing functions: const add = (a, b) => a + b;
It does not have its own this, arguments, or super, and cannot be used as a constructor.

5.What are template literals?

sol: String literals enclosed by backticks (`) that allow embedded expressions with ${} and multi-line strings easily.
Example: `Hello ${name}, you are ${age} years old!`