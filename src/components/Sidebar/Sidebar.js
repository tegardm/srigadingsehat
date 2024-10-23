import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { Nav } from "reactstrap";
import PerfectScrollbar from "perfect-scrollbar";
import logo from "logo.svg";

var ps;

function Sidebar(props) {
  const location = useLocation();
  const navigate = useNavigate(); // Untuk navigasi logout
  const sidebar = React.useRef();

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Hapus sesi login
    navigate("/login"); // Arahkan kembali ke halaman login
  };

  // Cek apakah user sudah login
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });

  return (
    <div
      className="sidebar"
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div className="logo">
        <a
          href="https://www.creative-tim.com"
          className="simple-text logo-mini"
        >
          <div className="logo-img">
            <img
              src='https://firebasestorage.googleapis.com/v0/b/srigadingsehat.appspot.com/o/thumbnails%2FLOGO%20KKN%20SRIGADING.png?alt=media&token=01d7b9ca-b16d-4006-9dd5-a874e9626315'
              alt="react-logo"
            />
          </div>
        </a>
        <a href="https://www.creative-tim.com" className="simple-text logo-normal">
          SrigadingSehat
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
      <Nav>
  {props.routes
    .filter(route => route.isVisible) // Filter rute untuk ditampilkan di sidebar
    .map((prop, key) => {
      return (
        <li
          className={activeRoute(prop.path) + (prop.pro ? " active-pro" : "")}
          key={key}
        >
          <NavLink to={prop.layout + prop.path} className="nav-NavLink">
            <i className={prop.icon} />
            <p>{prop.name}</p>
          </NavLink>
        </li>
      );
    })}

  {/* Tampilkan tombol Logout hanya jika user sudah login */}
  {isLoggedIn && (
    <li className="nav-item">
      <button
        onClick={handleLogout} // Panggil fungsi handleLogout saat tombol diklik
        className="nav-NavLink btn btn-danger w-100"
        style={{ marginTop: "10px" }}
      >
        <i className="nc-icon nc-button-power" />
        <p>Logout</p>
      </button>
    </li>
  )}
</Nav>

      </div>
    </div>
  );
}

export default Sidebar;
