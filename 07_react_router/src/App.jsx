// src/App.jsx
import "./App.css";
import "./index.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./Layout.jsx";

import Home from "./components/Home/Home.jsx";
import About from "./components/About/About.jsx";
import Contact from "./components/Contact/Contact.jsx"; // your spelling
import PrivacyPolicy from "./PrivacyPolicy.jsx";
import TermsConditions from "./TermsConditions.jsx";
import UserList from "./components/User/UserList.jsx";
import User from "./components/User/User.jsx";
import Github from "./components/Github/Github.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="github" element={<Github />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsConditions />} />
          <Route path="users" element={<UserList />} />
          <Route path="user/:userid" element={<User />} />
          <Route
            path="*"
            element={
              <div className="min-h-[300px] flex items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-800">
                  404 - Page Not Found
                </h1>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
