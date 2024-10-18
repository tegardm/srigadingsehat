import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap"; // Import React Bootstrap components

function Sekolah() {
  const [kegiatanData, setKegiatanData] = useState([]);
  const [error, setError] = useState(null);

  // Data Kegiatan Kesehatan Sekolah dengan Thumbnail Dummy Statis
  const kegiatanKesehatanSekolah = [
    {
      nama: "Skrining Kesehatan Sekolah",
      slug : "skrining-kesehatan-sekolah",
      deskripsi: "Pemeriksaan kesehatan secara menyeluruh untuk siswa guna mendeteksi dini masalah kesehatan.",
    },
    {
      nama: "BIAS (Bulan Imunisasi Anak Sekolah)",
      slug : 'bias',
      deskripsi: "Program imunisasi nasional yang diberikan kepada anak sekolah untuk mencegah penyakit menular.",
    },
  ];

  const { namadusun } = useParams();

  const dummyImage = "https://via.placeholder.com/300x200?text=Kegiatan+Kesehatan+Sekolah"; // Gambar dummy statis

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

  return (
    <div className="content">
      <Link to={`/admin/sekolah/tambah`}>
                    <Button variant="success" className="mr-2">Tambah Kegiatan</Button>
      </Link>
      <h2 className="mb-4">Data Kegiatan Kesehatan Sekolah Desa Srigading</h2>
      {error && <p>Error: {error}</p>}
      
      <Row>
        {kegiatanData && kegiatanData.length > 0 ? (
          kegiatanData.map((kegiatan, index) => (
            <Col md={6} key={index} className="mb-4">
              <Card>
                {/* Thumbnail Dummy Statis */}
                {/* <Card.Img variant="top" src={dummyImage} alt="Kegiatan Kesehatan Sekolah" /> */}

                <Card.Body>
                  <Card.Title>{kegiatan.nama ? kegiatan.nama : "Nama kegiatan tidak diketahui"}</Card.Title>
                  <Card.Text>
                    {kegiatan.deskripsi ? kegiatan.deskripsi : "Deskripsi tidak tersedia"}
                  </Card.Text>
                  <Link to={`/admin/sekolah/${kegiatan.slug}`}>
                    <Button variant="success" className="mr-2">Lihat Kegiatan</Button>
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

export default Sekolah;
