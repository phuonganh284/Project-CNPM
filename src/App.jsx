// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./components/HomePage";
import About from "./components/About";
import Welcome from "./components/Welcome";

const App = () => {
  return (
    <Router>
      <Routes>
        {/*Routes------------------------------------*/}
        <Route path="/" element={<Welcome />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
