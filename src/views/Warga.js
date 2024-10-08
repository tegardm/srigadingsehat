import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link } from "react-router-dom";
import $ from 'jquery'; // Import jQuery
import 'datatables.net'; // Import DataTables jQuery Plugin

function Kelahiran() {
  const [dusunData, setDusunData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchDusunData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "dusuns"));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setDusunData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching dusun data: ", err);
      }
    };

    fetchDusunData();
  }, []);

  // Inisialisasi DataTables setelah data dimuat
  useEffect(() => {
    if (dusunData.length > 0) {
      const table = $('#kelahiranTable').DataTable(); // Inisialisasi DataTable
      
      return () => {
        // Destroy DataTable sebelum komponen di-unmount atau di-re-render
        table.destroy();
      };
    }
  }, [dusunData]);

  return (
    <div className="content">
      <h2>Data Kependudukan Masyarakat Desa Srigading</h2>
      {error && <p>Error: {error}</p>}
      <table id="kelahiranTable" className="display">
        <thead>
          <tr>
            <th>Nama Dusun</th>
            <th>Jumlah Penduduk</th>
            <th>Alamat</th>
            <th>Action (Admin Only)</th>
          </tr>
        </thead>
        <tbody>
          {dusunData && dusunData.length > 0 ? (
            dusunData.map((dusun, index) => (
              <tr key={index}>
                <td>{dusun.nama ? dusun.nama : "Tidak diketahui"}</td>
                <td>{dusun.jumlah_penduduk ? dusun.jumlah_penduduk : "N/A"}</td>
                <td>{dusun.alamat ? dusun.alamat : "Alamat tidak tersedia"}</td>
                <td>
                  <Link to={`/admin/penduduk/${dusun.nama}`}>
                    <button className="p-2 m-2 bg-success rounded-lg text-white border-0">Show</button>
                  </Link>
                  <button className="p-2 m-2 bg-warning rounded-lg text-white border-0">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Data tidak tersedia.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Kelahiran;
