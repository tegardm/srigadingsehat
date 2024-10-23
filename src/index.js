import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import Home from 'views/frontend/index';
import Kesehatan from 'views/frontend/Kesehatan';
import DetailKesehatan from 'views/frontend/DetailKesehatan';

import Masyarakat from 'views/frontend/Masyarakat';

import AdminLayout from "layouts/Admin.js";
import Login from "views/Login";
import Register from "views/Register";
import Penduduk from "views/Penduduk"; // Import komponen Penduduk
import KesehatanSekolah from "views/frontend/KesehatanSekolah";
import DetailKesehatanSekolah from "views/frontend/KesehatanSekolahDetail";
import LingkunganDesa from "views/frontend/Lingkungan";
import LingkunganDetail from "views/frontend/LingkunganDetail";
import Fasilitas from "views/frontend/Fasilitas";
import FasilitasDetail from "views/frontend/FasilitasDetail";

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

      {/* Redirect root ke homepage */}
      <Route path="/" element={<Home />} />
      <Route path="/penduduk" element={<Masyarakat />} />
      <Route path="/fasilitas" element={<Fasilitas />} />
      <Route path="/fasilitas/:idfasilitas" element={<FasilitasDetail />} />

      <Route path="/lingkungan" element={<LingkunganDesa />} />
      <Route path="/lingkungan/:idlingkungan" element={<LingkunganDetail />} />
      <Route path="/kesehatan" element={<Kesehatan />} />
      <Route path="/kesehatan/:namadusun/:idkegiatan" element={<DetailKesehatan />} />
      <Route path="/kesehatan-sekolah" element={<KesehatanSekolah />} />
      <Route path="/kesehatan-sekolah/:idsekolah" element={<DetailKesehatanSekolah />} />

      {/* Halaman login dan register */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </BrowserRouter>
);
