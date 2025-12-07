
import React, { useState } from "react";

// useDispatch: Hook to send actions to Redux store
import { useDispatch } from "react-redux";


import { addTodo } from "../features/Todo/todoSlice";


// ---------------------------------------------------
// 🔥 AddTodo Component
// Purpose:
// - Provide an input box for typing a new todo
// - Dispatch the addTodo action when the form is submitted
// ---------------------------------------------------

function AddTodo() {
  // Redux hook: gives us the dispatch function
  const dispatch = useDispatch();

  // Local component state to hold text typed inside the input box
  // This state does NOT belong in Redux because it is temporary UI state
  const [todoText, setTodoText] = useState("");

  // ----------------------------------------------
  // handleSubmit: Called when form is submitted
  // - Prevents page reload
  // - Validates input
  // - Dispatches addTodo action
  // - Resets the input field
  // ----------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from refreshing the page (default behavior)

    // Prevent adding empty or whitespace-only todos
    if (!todoText.trim()) return;

    // Dispatch Redux action to add the new todo
    // addTodo(todoText) creates an action object like:
    // { type: "todos/addTodo", payload: "text user typed" }
    dispatch(addTodo(todoText));

    // Clear input after adding todo
    setTodoText("");
  };

  // ---------------------------------------------------
  // JSX UI: Form + Input + Button
  // - Input field is controlled by React state
  // - Form submission triggers handleSubmit()
  // ---------------------------------------------------

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      {/* Controlled Input Field */}
      <input
        type="text"
        className="todo-input"
        placeholder="Write a todo..."
        value={todoText} // Input shows current state value
        onChange={(e) => setTodoText(e.target.value)} // Update state on typing
      />

      {/* Button to submit form */}
      <button className="todo-add-btn" type="submit">
        Add
      </button>
    </form>
  );
}

// Export the component
export default AddTodo;
