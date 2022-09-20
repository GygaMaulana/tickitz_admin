import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Login, Admin } from "./pages";
import Movies from "./pages/Admin/components/Movies/Movies";
import Booking from "./pages/Admin/components/Booking/Booking";


const mainNavigation = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" index element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/movies" element={<Movies />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </div>
  );
};

export default mainNavigation;