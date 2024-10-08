import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "layouts/Admin.js";
import Login from "views/Login";
import Register from "views/Register";
import Penduduk from "views/Penduduk"; // Import komponen Penduduk

const root = ReactDOM.createRoot(document.getElementById("root"));

// Fungsi untuk memeriksa apakah user sudah login
const PrivateRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  return isLoggedIn ? element : <Navigate to="/login" />;
};

root.render(
  <BrowserRouter>
    <Routes>
      {/* Halaman Admin hanya bisa diakses jika user sudah login */}
      <Route path="/admin/*" element={<PrivateRoute element={<AdminLayout />} />}>
        {/* Tambahkan Route baru untuk halaman penduduk */}
        <Route path="penduduk/:namadusun" element={<Penduduk />} />
      </Route>
      
      {/* Redirect root ke dashboard jika sudah login */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Halaman login dan register */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </BrowserRouter>
);
