import { useEffect, useState } from "react";
import $ from 'jquery'; // Import jQuery
import 'datatables.net'; // Import DataTables jQuery Plugin
import { Link, useParams } from "react-router-dom";

function PendudukKategori2() {
  const { namadusun, kategori } = useParams(); // Get both namadusun and kategori from the URL
  const [dataWarga, setDataWarga] = useState([]);
  const [error, setError] = useState(null);

  // Dummy data for residents in different dusuns
  const wargaDesa = [
    { nama: "Budi Santoso", nik: "1234567890123456", alamat: "Jalan Mawar No. 1", jenisKelamin: "Laki-laki", usia: 3, dusun: "Mendek", kategori: "Balita" },
    { nama: "Siti Aminah", nik: "6543210987654321", alamat: "Jalan Melati No. 12", jenisKelamin: "Perempuan", usia: 7, dusun: "Jeruk", kategori: "Anak" },
    { nama: "Andi Wijaya", nik: "7896541230123456", alamat: "Jalan Kenanga No. 7", jenisKelamin: "Laki-laki", usia: 15, dusun: "Krajan", kategori: "Remaja" },
    { nama: "Dewi Lestari", nik: "3216549876543210", alamat: "Jalan Anggrek No. 5", jenisKelamin: "Perempuan", usia: 25, dusun: "Gading", kategori: "Dewasa" },
    { nama: "Eko Prasetyo", nik: "9876543210987654", alamat: "Jalan Tulip No. 9", jenisKelamin: "Laki-laki", usia: 65, dusun: "Mendek", kategori: "Lansia" },
    { nama: "Rina Dewi", nik: "5678901234567890", alamat: "Jalan Melati No. 10", jenisKelamin: "Perempuan", usia: 50, dusun: "Gading", kategori: "Dewasa" },
    { nama: "Arianto", nik: "0987654321098765", alamat: "Jalan Cempaka No. 3", jenisKelamin: "Laki-laki", usia: 4, dusun: "Gading", kategori: "Balita" },
    { nama: "Lina", nik: "1122334455667788", alamat: "Jalan Cempaka No. 5", jenisKelamin: "Perempuan", usia: 6, dusun: "Gading", kategori: "Anak" },
  ];

  useEffect(() => {
    // Simulate data fetching and filtering by 'namadusun' and 'kategori'
    const filteredData = wargaDesa.filter((warga) => 
        warga.dusun.toLowerCase().trim() === namadusun.toLowerCase().trim() &&
        warga.kategori.toLowerCase().trim() === kategori.toLowerCase().trim()
      );
      
      
      console.log('namadusun:', `"${namadusun}"`, 'kategori:', `"${kategori}"`);
      console.log(filteredData);
    setDataWarga(filteredData);
  }, [namadusun, kategori]); // Ensure both params trigger data fetching

  // Initialize DataTables after data is loaded
  useEffect(() => {
    if (dataWarga.length > 0) {
      const table = $('#pendudukTable').DataTable(); // Initialize DataTable
        console.log('ada kok data warga')
      return () => {
        // Destroy DataTable before component unmount or re-render
        table.destroy();
      };
    }
  }, [dataWarga]);

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
                <Link to={`/admin/penduduk/${namadusun}/kategori/${kategori}/${warga.nik}`}>
                    <button className="p-2 m-2 bg-success rounded-lg text-white border-0">Modifikasi</button>
                  </Link>
                  <button className="p-2 m-2 bg-warning rounded-lg text-white border-0">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Tidak ada data untuk dusun ini.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PendudukKategori2;
