import { useEffect, useState } from "react";
import $ from 'jquery';
import 'datatables.net';
import { Link, useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, query, where, deleteDoc, doc, addDoc } from "firebase/firestore";
import { db } from '../firebase/firebase';
import * as XLSX from 'xlsx';

function PendudukKategori2() {
  const { namadusun, kategori } = useParams();
  const [dataWarga, setDataWarga] = useState([]);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState(null); // Alert state

  const validDusun = ["krajan", "mendek", "jeruk", "gading"];

  useEffect(() => {
    const fetchDusunData = async () => {
      try {
        const dusunQuery = query(
          collection(db, "penduduks"),
          where("dusun", "==", namadusun),
          where("kategori", "==", kategori)
        );

        const querySnapshot = await getDocs(dusunQuery);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setDataWarga(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDusunData();
  }, [namadusun, kategori]);

  useEffect(() => {
    if (dataWarga.length > 0) {
      const table = $('#pendudukTable').DataTable();
      return () => table.destroy();
    }
  }, [dataWarga]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus data penduduk ini?');
    if (!confirmDelete) return;

    try {
      const pendudukRef = doc(db, 'penduduks', id);
      await deleteDoc(pendudukRef);
      setDataWarga(dataWarga.filter((warga) => warga.id !== id));
      showAlert('Data penduduk berhasil dihapus!', 'success');
    } catch (error) {
      console.error("Error deleting document: ", error);
      showAlert('Terjadi kesalahan saat menghapus data penduduk.', 'danger');
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const navigate = useNavigate();


  const handleFileUpload = async () => {
    if (!file) {
      showAlert("Please select a file to upload.", "danger");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      for (const row of jsonData) {
        const { nama, nik, alamat, jenis_kelamin, usia, dusun, kategori } = row;
  
        // Konversi `nik` ke string jika belum
        const nikString = nik.toString();
  
        // Mengubah jenis kelamin dari "L" menjadi "Laki-laki" dan "P" menjadi "Perempuan"
        const jenisKelaminFormatted = jenis_kelamin === "L" ? "Laki-laki" : jenis_kelamin === "P" ? "Perempuan" : jenis_kelamin;
  
        if (!validDusun.includes(dusun)) {
          showAlert(`Dusun "${dusun}" tidak valid. Hanya dapat memilih: ${validDusun.join(', ')}`, "danger");
          return;
        }
  
        try {
          await addDoc(collection(db, "penduduks"), {
            nama,
            nik: nikString,  // Pastikan NIK disimpan sebagai string
            alamat,
            jenis_kelamin: jenisKelaminFormatted,  // Menyimpan jenis kelamin yang sudah diformat
            usia,
            dusun,
            kategori
          });
        } catch (error) {
          console.error("Error uploading document: ", error);
          showAlert("Error uploading some data.", "danger");
          return;
        }
      }
      showAlert('Data berhasil diunggah!', 'success');
    };
    reader.readAsArrayBuffer(file);
  };
  
  
  

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000); // Clear alert after 3 seconds
  };

  return (
    <>
    <br/><br/>
    <div className="container mt-5">
      <h2 className="mb-4">Data Penduduk Kategori {kategori} di Dusun {namadusun}</h2>
      
      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* File input and submit button for uploading Excel file */}
      <div className="mb-3">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="form-control-file mb-2" />
        <button onClick={handleFileUpload} className="btn btn-primary">Upload Data</button>
        <br/>
        <small className="w-50">Gunakan Tombol Diatas Untuk Mengunggah Data Besar Berformat Excel (xlsx), jika upload gagal atau tidak berhasil masuk
          ke dalam List penduduk artinya format di Excel anda tidak benar, silahkan sesuai dengan contoh gambar dibawah
        </small>
        <br/>
        <img className="w-75 border" src="/assets/img/format.png"></img>
        <br/><br/><hr className='background-black color-black' />

      </div>
      <table id="pendudukTable" className="table table-striped">
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
          {dataWarga.length > 0 ? (
            dataWarga.map((warga, index) => (
              <tr key={index}>
                <td>{warga.nama}</td>
                <td>{warga.nik}</td>
                <td>{warga.alamat}</td>
                <td>{warga.jenis_kelamin}</td>
                <td>{warga.usia}</td>
                <td>{warga.dusun}</td>
                <td>{warga.kategori}</td>
                <td>
                  <Link to={`/admin/penduduk/${namadusun}/kategori/${kategori}/${warga.nik}/modifikasi`}>
                    <button className="btn btn-success btn-sm mr-2">Modifikasi</button>
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(warga.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">Tidak ada data untuk dusun ini.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  );
}

export default PendudukKategori2;
