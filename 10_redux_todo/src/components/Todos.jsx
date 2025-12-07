// ------------------------------------------------------------
// TODOS COMPONENT
// - Shows the full todo list
// - Handles edit mode, update, delete, complete toggle
// - Uses Redux store (useSelector + useDispatch)
// ------------------------------------------------------------

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Import Redux actions
import {
  deleteTodo,
  toggleComplete,
  updateTodo,
} from "../features/Todo/todoSlice";

// Component for adding a new todo
import AddTodo from "./AddTodo";

function Todos() {
  // Dispatch function to send actions to Redux
  const dispatch = useDispatch();

  /*
    READ todos from Redux global state.
    state = entire Redux store
    state.todos = array inside our todoSlice initialState
  */
  const todos = useSelector((state) => state.todos);

  // ---------------------------------------------------------
  // LOCAL STATE for editing mode (NOT stored in Redux)
  // ---------------------------------------------------------

  // which todo is being edited (null = none)
  const [editId, setEditId] = useState(null);

  // the text user types when editing a todo
  const [editText, setEditText] = useState("");

  // ---------------------------------------------------------
  // Start editing: load todo data into local state
  // ---------------------------------------------------------
  const handleStartEdit = (todo) => {
    setEditId(todo.id); // activate edit mode
    setEditText(todo.todo); // preload current text into input box
  };

  // ---------------------------------------------------------
  // Save edited todo → send update action to Redux
  // ---------------------------------------------------------
  const handleUpdateTodo = (id) => {
    if (!editText.trim()) return; // prevent saving empty text

    // Dispatch update action with new text
    dispatch(updateTodo({ id, todo: editText }));

    // Exit edit mode
    setEditId(null);
    setEditText("");
  };

  return (
    <div className="todo-container">
      {/* Title section */}
      <h2 className="todo-heading">Redux Todo App</h2>

      {/* COMPONENT: Add new todo input box */}
      <AddTodo />

      {/* ---------------------------------------------------------
         TODO LIST SECTION
      ---------------------------------------------------------- */}
      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id} // unique key for React
            className={`todo-item ${
              todo.completed ? "todo-item-completed" : ""
            }`}
          >
            {/* LEFT SIDE: checkbox + todo text or edit input */}
            <div className="todo-left">
              {/* Checkbox → toggles completed / uncompleted */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => dispatch(toggleComplete(todo.id))}
              />

              {/* If editing → show input box */}
              {editId === todo.id ? (
                <input
                  className="todo-edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                // Normal text when not editing
                <span className="todo-text">{todo.todo}</span>
              )}
            </div>

            {/* ---------------------------------------------------
               RIGHT SIDE: Action Buttons (Edit/Save + Delete)
            ---------------------------------------------------- */}
            <div className="todo-actions">
              {/* If in edit mode → show SAVE BUTTON */}
              {editId === todo.id ? (
                <button
                  className="todo-btn save"
                  onClick={() => handleUpdateTodo(todo.id)}
                >
                  💾 Save {/* Save icon */}
                </button>
              ) : (
                /* If NOT editing → show EDIT BUTTON */
                <button
                  className="todo-btn edit"
                  onClick={() => handleStartEdit(todo)}
                >
                  ✏️ Edit {/* Pencil icon */}
                </button>
              )}

              {/* DELETE BUTTON → remove todo */}
              <button
                className="todo-btn delete"
                onClick={() => dispatch(deleteTodo(todo.id))}
              >
                🗑️ Delete {/* Trash icon */}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* MESSAGE: when no todos exist */}
      {todos.length === 0 && (
        <p className="todo-empty">No todos yet. Add one above! 🙂</p>
      )}
    </div>
  );
}

export default Todos;
