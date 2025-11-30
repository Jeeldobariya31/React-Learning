# ⚛️ React + Vite Basic Project
_A simple project to understand components, JSX, and React rendering._

This project demonstrates the **basic working of React**, created using **Vite**.  
It includes:

- React setup using Vite  
- ReactDOM rendering with `main.jsx`
- Component creation (`Jeel.jsx`)
- Importing & using components inside `App.jsx`

---

## 🚀 1. Project Setup (Vite + React)

To create this project:

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

---

## 📁 2. Folder Structure

```
src/
│── Jeel.jsx
│── App.jsx
│── main.jsx
│── index.css
```

---

## 📜 3. What This Project Teaches

### ✔ How React renders UI  
React uses `createRoot` to render `<App />` inside the `<div id="root">` in `index.html`.

### ✔ How components work  
The `Jeel` component is created separately and imported into `App.jsx`.

### ✔ JSX basics  
JSX allows writing HTML-like code inside JavaScript functions.

### ✔ React’s component-based architecture  
UI is split into reusable components.

---

## 🎯 4. Goal of This Mini Project

- Understand components  
- Learn import/export  
- Understand JSX rendering  
- Get comfortable with the React + Vite setup  
