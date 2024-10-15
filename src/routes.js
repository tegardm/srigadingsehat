import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import WargaList from "views/Warga";
import PendudukList from "views/Penduduk";
import PendudukTambah from "views/PendudukTambah";

import PendudukList2 from "views/Penduduk2";
import PendudukModifikasi from "views/PendudukModifikasi";
import DesaKegiatan from "views/DesaKegiatan";
import DesaModifikasi from "views/DesaModifikasi";
import Desa from "views/Desa";
import Sekolah from "views/Sekolah";
import SekolahTambah from "views/SekolahTambah";
import SekolahList from "views/SekolahList";
import SekolahDetail from "views/SekolahDetail";
import DesaDetailKegiatan from "views/DesaDetailKegiatan";
import DesaTambah from "views/DesaTambah";
import LingkunganTambah from "views/LingkunganTambah";

import Lingkungan from "views/Lingkungan";
import LingkunganDetailAdmin from "views/LingkunganDetailAdmin";
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
    isVisible: true
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: <UserPage />,
    layout: "/admin",
    isVisible: true
  },
  {
    path: "/penduduk",
    name: "Data Kependudukan",
    icon: "nc-icon nc-tile-56",
    component: <WargaList />,
    layout: "/admin",
    isVisible: true
  },
  {
    path: "/penduduk/:namadusun",
    name: "Data Kependudukan Detail",
    icon: "nc-icon nc-tile-56",
    component: <PendudukList />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/penduduk/:namadusun/tambah",
    name: "Data Kependudukan Detail",
    icon: "nc-icon nc-tile-56",
    component: <PendudukTambah />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/penduduk/:namadusun/kategori/:kategori",
    name: "Data Kependudukan Detail",
    icon: "nc-icon nc-tile-56",
    component: <PendudukList2 />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/penduduk/:namadusun/kategori/:kategori/:nik",
    name: "Data Kependudukan Detail",
    icon: "nc-icon nc-tile-56",
    component: <PendudukModifikasi />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/desa",
    name: "Kesehatan Desa",
    icon: "nc-icon nc-tile-56",
    component: <Desa />,
    layout: "/admin",
    isVisible: true
  },
  {
    path: "/desa/:namadusun",
    name: "Posyandu Desa",
    icon: "nc-icon nc-tile-56",
    component: <DesaKegiatan />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/desa/:namadusun/kegiatan/:namakegiatan",
    name: "Posyandu Desa",
    icon: "nc-icon nc-tile-56",
    component: <DesaDetailKegiatan />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/desa/:namadusun/kegiatan/tambah",
    name: "Posyandu Desa",
    icon: "nc-icon nc-tile-56",
    component: <DesaTambah />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/desa/:namadusun/kegiatan/:namakegiatan/modifikasi",
    name: "Posyandu Desa",
    icon: "nc-icon nc-tile-56",
    component: <DesaModifikasi />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/sekolah",
    name: "Kesehatan Sekolah",
    icon: "nc-icon nc-caps-small",
    component: <Sekolah />,
    layout: "/admin",
    isVisible: true
  },
  {
    path: "/sekolah/:namakegiatan",
    name: "List Sekolah",
    icon: "nc-icon nc-caps-small",
    component: <SekolahList />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/sekolah/tambah",
    name: "Tambah Sekolah",
    icon: "nc-icon nc-caps-small",
    component: <SekolahTambah />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/sekolah/:namakegiatan/:namasekolah",
    name: "Kegiatan Sekolah",
    icon: "nc-icon nc-caps-small",
    component: <SekolahDetail />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/sekolah/:namakegiatan/:namasekolah/modifikasi",
    name: "Kegiatan Sekolah",
    icon: "nc-icon nc-caps-small",
    component: <SekolahModifikasi />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/lingkungan",
    name: "Lingkungan",
    icon: "nc-icon nc-caps-small",
    component: <Lingkungan />,
    layout: "/admin",
    isVisible: true
  },
  {
    path: "/lingkungan/tambah",
    name: "Lingkungan",
    icon: "nc-icon nc-caps-small",
    component: <LingkunganTambah />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/lingkungan/:kegiatan",
    name: "Lingkungan",
    icon: "nc-icon nc-caps-small",
    component: <LingkunganDetailAdmin />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/lingkungan/:kegiatan/modifikasi",
    name: "Lingkungan",
    icon: "nc-icon nc-caps-small",
    component: <LingkunganModifikasi />,
    layout: "/admin",
    isVisible: false
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-caps-small",
    component: <Typography />,
    layout: "/admin",
    isVisible: true
  },
];

export default routes;
