import { useEffect, useState } from "react";
import $ from 'jquery'; // Import jQuery
import 'datatables.net'; // Import DataTables jQuery Plugin
import { Link, useParams } from "react-router-dom";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebase/firebase'; // Make sure this imports your Firebase configuration

function PendudukKategori2() {
  const { namadusun, kategori } = useParams(); // Get both namadusun and kategori from the URL
  const [dataWarga, setDataWarga] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDusunData = async () => {
      try {
        // Log the parameters to check if they are being received correctly
        console.log('Fetching data for dusun:', namadusun, 'kategori:', kategori);
  
        // Create a query to filter data by 'dusun' and 'kategori'
        const dusunQuery = query(
          collection(db, "penduduks"),
          where("dusun", "==", namadusun),
          where("kategori", "==", kategori)
        );
        
        // Fetch the filtered data
        const querySnapshot = await getDocs(dusunQuery);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Save the document ID for deletion
          ...doc.data()
        }));
  
        // Log the fetched data to check if any data is retrieved
        console.log('Data fetched:', data);
        
        setDataWarga(data); // Update the state with the filtered data
      } catch (err) {
        setError(err.message);
        console.error("Error fetching dusun data: ", err);
      }
    };
  
    fetchDusunData(); // Call the fetch function
  }, [namadusun, kategori]); // Refetch data if these parameters change
  
  // Initialize DataTables after data is loaded
  useEffect(() => {
    if (dataWarga.length > 0) {
      const table = $('#pendudukTable').DataTable(); // Initialize DataTable
      
      return () => {
        // Destroy DataTable before component unmount or re-render
        table.destroy();
      };
    }
  }, [dataWarga]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus data penduduk ini?');
    if (!confirmDelete) return; // Exit if user does not confirm

    try {
      // Delete the document from Firestore
      const pendudukRef = doc(db, 'penduduks', id);
      await deleteDoc(pendudukRef);

      // Remove the deleted record from the state to update the table
      setDataWarga(dataWarga.filter((warga) => warga.id !== id));

      alert('Data penduduk berhasil dihapus!');
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert('Terjadi kesalahan saat menghapus data penduduk.');
    }
  };

  return (
    <div className="content">
      <h2>Data Penduduk Kategori {kategori} di Dusun {namadusun}</h2>
      {error && <p>Error: {error}</p>}
      
      <table id="pendudukTable" className="display">
        <thead>
          <tr>
            <th>Nama</th>
            <th>NIK</th>
            <th>Alamat</th>
            <th>Jenis Kelamin</th>
            <th>Usia</th>
            <th>Dusun</th>
            <th>Kategori</th>
            <th>Action (Admin Only)</th>
          </tr>
        </thead>
        
        <tbody>
          {dataWarga && dataWarga.length > 0 ? (
            dataWarga.map((warga, index) => (
              <tr key={index}>
                <td>{warga.nama}</td>
                <td>{warga.nik}</td>
                <td>{warga.alamat}</td>
                <td>{warga.jenisKelamin}</td>
                <td>{warga.usia}</td>
                <td>{warga.dusun}</td>
                <td>{warga.kategori}</td>
                <td>
                  <Link to={`/admin/penduduk/${namadusun}/kategori/${kategori}/${warga.nik}/modifikasi`}>
                    <button className="p-2 m-2 bg-success rounded-lg text-white border-0">Modifikasi</button>
                  </Link>
                  <button
                    className="p-2 m-2 bg-warning rounded-lg text-white border-0"
                    onClick={() => handleDelete(warga.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Tidak ada data untuk dusun ini.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PendudukKategori2;
