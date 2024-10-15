import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap"; // Import React Bootstrap components

function DesaKegiatan() {
  const [kegiatanData, setKegiatanData] = useState([]);
  const [error, setError] = useState(null);

  // Data Kegiatan Kesehatan dengan Thumbnail Dummy Statis
  const kegiatanKesehatan = [
    {
      nama: "Posyandu Kesehatan",
      deskripsi: "Layanan kesehatan rutin untuk ibu dan anak.",
      slug: "posyandu-kesehatan",
    },
    {
      nama: "Pemeriksaan Dasar (Krening Kesehatan)",
      deskripsi: "Pemeriksaan dasar untuk deteksi awal penyakit.",
      slug: "pemeriksaan-dasar-krening-kesehatan",
    },
    {
      nama: "Pemeriksaan Dasar (Pemeriksaan Kehamilan)",
      deskripsi: "Pemeriksaan kesehatan ibu hamil.",
      slug: "pemeriksaan-dasar-pemeriksaan-kehamilan",
    },
    {
      nama: "Imunisasi Dasar",
      deskripsi: "Imunisasi untuk anak-anak dan ibu hamil.",
      slug: "imunisasi-dasar",
    },
    {
      nama: "Pemantauan Gizi Anak",
      deskripsi: "Pemantauan perkembangan gizi anak-anak.",
      slug: "pemantauan-gizi-anak",
    },
    {
      nama: "Stunting",
      deskripsi: "Program pencegahan dan penanganan stunting.",
      slug: "stunting",
    },
    {
      nama: "DDTK",
      deskripsi: "Deteksi dini tumbuh kembang anak.",
      slug: "ddtk",
    },
  ];
  

  const {namadusun} = useParams()

  const dummyImage = "https://via.placeholder.com/300x200?text=Kegiatan+Kesehatan"; // Gambar dummy statis

  useEffect(() => {
    // Simulasi pengambilan data dari Firestore
    const fetchKegiatanData = async () => {
      try {
        setKegiatanData(kegiatanKesehatan);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching kegiatan data: ", err);
      }
    };

    fetchKegiatanData();
  }, []);

  return (
    <div className="content">
      <h2>Data Kegiatan Kesehatan Masyarakat Desa Srigading</h2>
      {error && <p>Error: {error}</p>}
      <Link to={`/admin/desa/${namadusun}/kegiatan/tambah`}>
                    <Button variant="success" className="mr-2">Tambah Kegiatan</Button>
      </Link>
      <Row>
        {kegiatanData && kegiatanData.length > 0 ? (
          kegiatanData.map((kegiatan, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card>
                {/* Thumbnail Dummy Statis */}
                <Card.Img variant="top" src={dummyImage} alt="Kegiatan Kesehatan" />

                <Card.Body>
                  <Card.Title>{kegiatan.nama ? kegiatan.nama : "Nama kegiatan tidak diketahui"}</Card.Title>
                  <Card.Text>
                    {kegiatan.deskripsi ? kegiatan.deskripsi : "Deskripsi tidak tersedia"}
                  </Card.Text>
                  <Link to={`/admin/desa/${namadusun}/kegiatan/${kegiatan.slug}`}>
                    <Button variant="success" className="mr-2">Lihat Kegiatan</Button>
                  </Link>
                  <Link to={`/admin/desa/${namadusun}/kegiatan/${kegiatan.slug}/modifikasi`}>
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

export default DesaKegiatan;
