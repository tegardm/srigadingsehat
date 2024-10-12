/*!

=========================================================
* Paper Dashboard React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import WargaList from "views/Warga";
import PendudukList from "views/Penduduk";
import PendudukList2 from "views/Penduduk2";
import PendudukModifikasi from "views/PendudukModifikasi";
import DesaKegiatan from "views/DesaKegiatan";
import DesaModifikasi from "views/DesaModifikasi";
import Desa from "views/Desa";
import Sekolah from "views/Sekolah";
import SekolahList from "views/SekolahList";
import SekolahDetail from "views/SekolahDetail";
import DesaDetailKegiatan from "views/DesaDetailKegiatan";
import Lingkungan from "views/Lingkungan";
import LingkunganDetail from "views/LingkunganDetail";
import UserPage from "views/User.js";
import SekolahModifikasi from "views/SekolahModifikasi";
import LingkunganModifikasi from "views/LingkunganModifikasi";


var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/admin",
    isVisible: true // Ubah ini untuk konsistensi
  },

  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: <UserPage />,
    layout: "/admin",
    isVisible: true // Ubah ini untuk konsistensi
  },
  {
    path: "/penduduk",
    name: "Data Kependudukan",
    icon: "nc-icon nc-tile-56",
    component: <WargaList />,
    layout: "/admin",
    isVisible: true // Ubah ini untuk konsistensi
  },
  {
    path: "/penduduk/:namadusun",
    name: "Data Kependudukan Detail", // Beri nama yang sesuai
    icon: "nc-icon nc-tile-56",
    component: <PendudukList />,
    layout: "/admin",
    isVisible: false // Rute ini tidak ditampilkan di sidebar
  },
  {
    path: "/penduduk/:namadusun/kategori/:kategori",
    name: "Data Kependudukan Detail", // Beri nama yang sesuai
    icon: "nc-icon nc-tile-56",
    component: <PendudukList2 />,
    layout: "/admin",
    isVisible: false // Rute ini tidak ditampilkan di sidebar
  },
  {
    path: "/penduduk/:namadusun/kategori/:kategori/:nik",
    name: "Data Kependudukan Detail", // Beri nama yang sesuai
    icon: "nc-icon nc-tile-56",
    component: <PendudukModifikasi />,
    layout: "/admin",
    isVisible: false // Rute ini tidak ditampilkan di sidebar
  },
  {
    path: "/desa",
    name: " Kesehatan Desa ", // Beri nama yang sesuai
    icon: "nc-icon nc-tile-56",
    component: <Desa />,
    layout: "/admin",
    isVisible: true // Rute ini tidak ditampilkan di sidebar
  },
  {
    path: "/desa/:namadusun",
    name: " Posyandu Desa ", // Beri nama yang sesuai
    icon: "nc-icon nc-tile-56",
    component: <DesaKegiatan />,
    layout: "/admin",
    isVisible: false // Rute ini tidak ditampilkan di sidebar
  },
  {
    path: "/desa/:namadusun/kegiatan/:namakegiatan",
    name: " Posyandu Desa ", // Beri nama yang sesuai
    icon: "nc-icon nc-tile-56",
    component: <DesaDetailKegiatan />,
    layout: "/admin",
    isVisible: false // Rute ini tidak ditampilkan di sidebar
  },
  {
    path: "/desa/:namadusun/kegiatan/:namakegiatan/modifikasi",
    name: " Posyandu Desa ", // Beri nama yang sesuai
    icon: "nc-icon nc-tile-56",
    component: <DesaModifikasi />,
    layout: "/admin",
    isVisible: false // Rute ini tidak ditampilkan di sidebar
  },
  {
    path: "/sekolah",
    name: "Kesehatan Sekolah",
    icon: "nc-icon nc-caps-small",
    component: <Sekolah/>, // Referensi ke komponen, bukan JSX
    layout: "/admin",
    isVisible: true
  },
  {
    path: "/sekolah/:namakegiatan",
    name: "List Sekolah",
    icon: "nc-icon nc-caps-small",
    component: <SekolahList/>, // Referensi ke komponen, bukan JSX
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/sekolah/:namakegiatan/:namasekolah",
    name: "Kegiatan Sekolah",
    icon: "nc-icon nc-caps-small",
    component: <SekolahDetail/>, // Referensi ke komponen, bukan JSX
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/sekolah/:namakegiatan/:namasekolah/modifikasi",
    name: "Kegiatan Sekolah",
    icon: "nc-icon nc-caps-small",
    component: <SekolahModifikasi/>, // Referensi ke komponen, bukan JSX
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/lingkungan",
    name: "Lingkungan",
    icon: "nc-icon nc-caps-small",
    component: <Lingkungan />,
    layout: "/admin",
    isVisible: true // Ubah ini untuk konsistensi
  },
  {
    path: "/lingkungan/:kegiatan",
    name: "Lingkungan",
    icon: "nc-icon nc-caps-small",
    component: <LingkunganDetail />,
    layout: "/admin",
    isVisible: false // Ubah ini untuk konsistensi
  },
  {
    path: "/lingkungan/:kegiatan/modifikasi",
    name: "Lingkungan",
    icon: "nc-icon nc-caps-small",
    component: <LingkunganModifikasi />,
    layout: "/admin",
    isVisible: false // Ubah ini untuk konsistensi
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-caps-small",
    component: <Typography />,
    layout: "/admin",
    isVisible: true // Ubah ini untuk konsistensi
  },
];
export default routes;

