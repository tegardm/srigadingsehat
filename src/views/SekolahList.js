import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions

function SekolahList() {
  const [sekolahData, setSekolahData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [error, setError] = useState(null);
  const { idkegiatan, namakegiatan } = useParams(); // Use params from URL
  
  // Fetch data from Firestore
  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        // Mendapatkan referensi ke dokumen kegiatan berdasarkan idkegiatan
        const kegiatanRef = doc(db, "kegiatansekolahs", idkegiatan);
        // Mendapatkan dokumen kegiatan
        const kegiatanSnapshot = await getDoc(kegiatanRef);

        if (kegiatanSnapshot.exists()) {
          const kegiatanData = { id: kegiatanSnapshot.id, ...kegiatanSnapshot.data() };

          // Jika terdapat properti 'sekolah' dalam data kegiatan
          if (kegiatanData.sekolah) {
            const sekolahList = kegiatanData.sekolah.map((sekolah) => ({
              id: sekolah.id, // atau sesuaikan dengan struktur data yang ada
              ...sekolah,
            }));
            setSekolahData(sekolahList);
          } else {
            setSekolahData([]); // Jika tidak ada data sekolah
          }
        } else {
          setError("Kegiatan tidak ditemukan.");
        }
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error(err);
      }
    };

    fetchKegiatan();
  }, [idkegiatan]); // Rerun the effect when idkegiatan changes

  // Filter data based on search input
  const filteredSekolahData = sekolahData.filter((sekolah) =>
    sekolah.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content">
      <h2>Data Sekolah untuk Kegiatan: {namakegiatan}</h2>
      <Link to={`/admin/sekolah/${idkegiatan}/tambah-sekolah`}>
        <Button variant="success" className="btn-block">
          Tambah Sekolah
        </Button>
      </Link>
      
      {/* Display error message */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Search input */}
      <Form.Group controlId="search">
        <Form.Control
          type="text"
          placeholder="Cari Sekolah..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        />
      </Form.Group>
      <br />
      <Row>
        {filteredSekolahData.length > 0 ? (
          filteredSekolahData.map((sekolah) => (
            <Col md={4} key={sekolah.id} className="mb-4">
              <Card>
                {/* Display thumbnail if available, otherwise use a placeholder */}
                <Card.Img
                  variant="top"
                  src={sekolah.thumbnail || "https://via.placeholder.com/300x200?text=Sekolah+Srigading"}
                  alt={sekolah.nama}  style={{ width: '500px', height: '250px', objectFit: 'cover' }}

                />
                <Card.Body>
                  <Card.Title>{sekolah.nama || "Nama sekolah tidak diketahui"}</Card.Title>
                  <Card.Text>{sekolah.kegiatan.description || "Deskripsi tidak tersedia"}</Card.Text>
                  <Link to={`/admin/sekolah/${namakegiatan}/${sekolah.id}`}>
                    <Button variant="success" className="mr-2">
                      Lihat Kegiatan
                    </Button>
                  </Link>
                  <Link to={`/admin/sekolah/${namakegiatan}/${sekolah.id}/modifikasi`}>
                    <Button variant="warning" className="mr-2">
                      Modifikasi
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>Data tidak tersedia atau tidak ada hasil pencarian.</p>
        )}
      </Row>
    </div>
  );
}

export default SekolahList;
