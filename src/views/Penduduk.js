import { useParams, Link } from "react-router-dom";

function PendudukKategori() {
  const { namadusun } = useParams(); // Ambil nama dusun dari URL

  const kategoriPenduduk = [
    { nama: "Balita", usia: "0-5" },
    { nama: "Anak", usia: "6-12" },
    { nama: "Remaja", usia: "13-17" },
    { nama: "Dewasa", usia: "18-59" },
    { nama: "Lansia", usia: "60+" }
  ];

  return (
    <div className="content">
      <h2>Kategori Penduduk di Dusun {namadusun}</h2>
      <Link to={`/admin/penduduk/${namadusun}/tambah/`}>
                  <button className="p-2 m-2 bg-success rounded-lg text-white border-0">
                    Tambah Data
                  </button>
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th>Kategori</th>
            <th>Usia</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {kategoriPenduduk.map((kategori, index) => (
            <tr key={index}>
              <td>{kategori.nama}</td>
              <td>{kategori.usia}</td>
              <td>
                <Link to={`/admin/penduduk/${namadusun}/kategori/${kategori.nama}`}>
                  <button className="p-2 m-2 bg-success rounded-lg text-white border-0">
                    Show
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PendudukKategori;
