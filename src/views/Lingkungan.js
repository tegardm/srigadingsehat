import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Form, InputGroup } from "react-bootstrap"; // Import additional components

function Lingkungan() {
  const [kegiatanData, setKegiatanData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [error, setError] = useState(null);

  // Data Kegiatan Kesehatan Sekolah dengan Thumbnail Dummy Statis
  const kegiatanKesehatanSekolah = [
    {
      nama: "Prilaku Hidup Bersih dan Sehat (PHBS)",
      slug: "phbs",
      deskripsi: "Pemeriksaan kesehatan secara menyeluruh untuk siswa guna mendeteksi dini masalah kesehatan.",
    },
    // Tambahkan lebih banyak kegiatan jika diperlukan
  ];

  const { namadusun } = useParams();

  useEffect(() => {
    // Simulasi pengambilan data dari Firestore
    const fetchKegiatanData = async () => {
      try {
        setKegiatanData(kegiatanKesehatanSekolah);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching kegiatan data: ", err);
      }
    };

    fetchKegiatanData();
  }, []);

  // Fungsi untuk menangani perubahan pencarian
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter kegiatan berdasarkan search term
  const filteredKegiatan = kegiatanData.filter((kegiatan) =>
    kegiatan.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content">
      <h2 className="mb-4">Data Kegiatan Kesehatan Sekolah Desa Srigading</h2>
      <Link to={`/admin/lingkungan/tambah`}>
        <Button variant="success" className="mr-2">Tambah Kegiatan</Button>
      </Link>
      {error && <p>Error: {error}</p>}

      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Cari kegiatan..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </InputGroup>

      <Row>
        {filteredKegiatan && filteredKegiatan.length > 0 ? (
          filteredKegiatan.map((kegiatan, index) => (
            <Col md={6} key={index} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{kegiatan.nama ? kegiatan.nama : "Nama kegiatan tidak diketahui"}</Card.Title>
                  <Card.Text>
                    {kegiatan.deskripsi ? kegiatan.deskripsi : "Deskripsi tidak tersedia"}
                  </Card.Text>
                  <Link to={`/admin/lingkungan/${kegiatan.slug}`}>
                    <Button variant="success" className="mr-2">Lihat Kegiatan</Button>
                  </Link>
                  <Link to={`/admin/lingkungan/${kegiatan.slug}/modifikasi`}>
                    <Button variant="warning" className="mr-2">Modifikasi</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>Data tidak tersedia.</p>
        )}
      </Row>
    </div>
  );
}

export default Lingkungan;
