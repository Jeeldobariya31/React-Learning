import { createContext, useContext } from "react";

export const TodoContext = createContext({
        todos: [
                {
                        id: 1,
                        todo: "Todo MSG",
                        completed: false
                }
        ],
        addTodo: (todo) => { },
        updateTodo: (id, todo) => { },
        deleteTodo: (id) => { },
        toggleComplete: (id) => { }
});

export const useTodo = () => {
        const context = useContext(TodoContext);
        return context;
}

export const TodoProvider = TodoContext.Provider;
