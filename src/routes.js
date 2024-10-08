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

import Maps from "views/Map.js";
import UserPage from "views/User.js";

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
    path: "/maps",
    name: "Maps",
    icon: "nc-icon nc-pin-3",
    component: <Maps />,
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
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-caps-small",
    component: <Typography />,
    layout: "/admin",
    isVisible: true // Ubah ini untuk konsistensi
  },
];
export default routes;

