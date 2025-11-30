# ⚛️ React + NPX Create-React-App Basic Project
_A simple project to understand components, JSX, and React rendering._

This project demonstrates the **basic working of React**, created using **NPX Create-React-App**.  
It includes:

- React setup using Create-React-App  
- ReactDOM rendering with `index.js`
- Component creation (`Jeel.js`)
- Importing & using components inside `App.js`

---

## 🚀 1. Project Setup (NPX Create-React-App)

To create this project:

```bash
npx create-react-app my-react-app
cd my-react-app
npm start
```

This will start the development server on:

```
http://localhost:3000
```

---

## 📁 2. Folder Structure

```
src/
│── Jeel.js
│── App.js
│── index.js
│── index.css
public/
package.json
```

---

## 📜 3. What This Project Teaches

### ✔ How React renders UI  
React uses `createRoot` to render `<App />` inside the `<div id="root">` in `public/index.html`.

### ✔ How components work  
The `Jeel` component is created separately and imported into `App.js`.

### ✔ JSX basics  
JSX allows writing HTML-like code inside JavaScript functions.

### ✔ React’s component-based architecture  
UI is split into smaller reusable components.

---

## 🎯 4. Goal of This Mini Project

- Understand components  
- Learn import/export  
- Understand JSX rendering  
- Get comfortable with the React + CRA setup
