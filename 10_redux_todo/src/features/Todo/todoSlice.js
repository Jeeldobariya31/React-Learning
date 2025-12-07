// Importing tools from Redux Toolkit
// - createSlice: helps us create reducer + actions in one place
// - nanoid: generates unique IDs for each todo item
import { createSlice, nanoid } from "@reduxjs/toolkit";

/* 
  🔹 Helper Function: loadInitialTodos

  Purpose:
  - Read previously saved todos from localStorage (if they exist).
  - If nothing is saved, return a default todo list.

  Why we need this:
  - When the user refreshes the page, Redux state resets.
  - localStorage lets us persist data between page reloads.
*/
const loadInitialTodos = () => {
  try {
    // Try to read the "todos" key from localStorage (string or null)
    const stored = localStorage.getItem("todos");

    // If there is something stored, parse it from JSON string → JS array
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    // If JSON is invalid or localStorage is blocked, log the error
    console.error("Error reading todos from localStorage", e);
  }

  // If no todos in localStorage or error happens:
  // return a default initial todo array so UI has something to show
  return [
    {
      id: 1, // a fixed ID just for the default todo
      todo: "Todo MSG", // default message
      completed: false, // not completed initially
    },
  ];
};

/*
  🔹 Helper Function: saveTodos

  Purpose:
  - Write the current todos array into localStorage as JSON.

  Why a separate function:
  - We need to call saving logic from multiple reducers (add, update, delete, toggle).
  - DRY (Don't Repeat Yourself) → put logic in one place.
*/
const saveTodos = (todos) => {
  try {
    // Convert the todos array into a string and store it
    localStorage.setItem("todos", JSON.stringify(todos));
  } catch (e) {
    // Handle any issue while writing (e.g. storage full, blocked)
    console.error("Error saving todos to localStorage", e);
  }
};

/*
  🔹 initialState

  This is the starting state of our todo slice.
  - It has one property: `todos`, which is an array of todo objects.
  - We call loadInitialTodos() so that:
      - if localStorage has data → use it
      - otherwise → use default array
*/
const initialState = {
  todos: loadInitialTodos(),
};

/*
  🔹 createSlice

  What it does:
  - Automatically creates:
      1. a reducer function
      2. action creators
  - Based on:
      - name: slice name
      - initialState: starting data
      - reducers: an object of "case reducers" (functions that handle actions)

  Important:
  - Inside these reducers, we are allowed to "mutate" state directly
    (e.g., state.todos.push()) because Redux Toolkit uses Immer under the hood.
    Immer converts these "mutations" into safe immutable updates.
*/
export const todoSlice = createSlice({
  name: "todos", // slice name → used as prefix for action types
  initialState, // the state structure defined above
  reducers: {
    /*
      🔹 addTodo reducer

      Action payload:
      - a string, which is the todo text

      What it does:
      1. Creates a new todo object with:
          - a unique id from nanoid()
          - todo text from action.payload
          - completed set to false
      2. Pushes it into state.todos
      3. Saves the updated todos array into localStorage
    */
    addTodo: (state, action) => {
      const newTodo = {
        id: nanoid(), // unique random ID (like "V1StGXR8_Z5jdHi6B-myT")
        todo: action.payload, // the text passed while dispatching addTodo("text")
        completed: false, // new todo is incomplete by default
      };

      // Because of Immer, we can "mutate" state directly
      state.todos.push(newTodo);

      // Persist new state into localStorage
      saveTodos(state.todos);
    },

    /*
      🔹 updateTodo reducer

      Action payload:
      - an object with { id, todo }
        - id: which todo to update
        - todo: new text for that todo

      What it does:
      1. Finds the index of the todo with the matching id
      2. If found, updates the `todo` text
      3. Saves the updated todos into localStorage
    */
    updateTodo: (state, action) => {
      const { id, todo } = action.payload;

      // Find the index of the todo object inside the array
      const todoIndex = state.todos.findIndex((t) => t.id === id);

      // If a todo with that id exists
      if (todoIndex !== -1) {
        // Update its text
        state.todos[todoIndex].todo = todo;

        // Save the latest version into localStorage
        saveTodos(state.todos);
      }
      // If not found, nothing happens (you could add else to handle errors)
    },

    /*
      🔹 deleteTodo reducer

      Action payload:
      - an id (string or number) of the todo to delete

      What it does:
      1. Filters out the todo whose id matches action.payload
      2. Replaces state.todos with the filtered array
      3. Saves the updated todos into localStorage
    */
    deleteTodo: (state, action) => {
      // Keep only todos whose id !== payload
      state.todos = state.todos.filter((t) => t.id !== action.payload);

      // Persist updated array
      saveTodos(state.todos);
    },

    /*
      🔹 toggleComplete reducer

      Action payload:
      - an id of the todo whose "completed" status we want to toggle

      What it does:
      1. Finds todo by id
      2. Flips its completed value:
          - if false → true
          - if true → false
      3. Saves updated todos into localStorage
    */
    toggleComplete: (state, action) => {
      // Find index of the todo with matching id
      const todoIndex = state.todos.findIndex((t) => t.id === action.payload);

      if (todoIndex !== -1) {
        // Flip the completed boolean
        state.todos[todoIndex].completed = !state.todos[todoIndex].completed;

        // Save updated state
        saveTodos(state.todos);
      }
    },
  },
});

/*
  🔹 Exporting actions

  createSlice automatically created action creators with the same
  names as our reducers: addTodo, updateTodo, deleteTodo, toggleComplete.

  Example usage in a component:
    dispatch(addTodo("Learn Redux Toolkit"));
    dispatch(updateTodo({ id: "abc", todo: "New text" }));
    dispatch(deleteTodo("abc"));
    dispatch(toggleComplete("abc"));
*/
export const { addTodo, updateTodo, deleteTodo, toggleComplete } =
  todoSlice.actions;

/*
  🔹 Exporting the reducer

  This is the reducer function generated by createSlice.
  We will give this to the Redux store.

  Example in store.js:
    import { configureStore } from "@reduxjs/toolkit";
    import todoReducer from "./todoSlice";

    export const store = configureStore({
      reducer: {
        todos: todoReducer,
      },
    });
*/
export default todoSlice.reducer;
