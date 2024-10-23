import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { db } from "../firebase/firebase"; // Import Firestore configuration
import { collection, getDocs, query, where } from "firebase/firestore"; // Firestore functions

function Lingkungan() {
  const [kegiatanData, setKegiatanData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [error, setError] = useState(null);
  const { namadusun } = useParams(); // Get dusun from params if needed

  useEffect(() => {
    // Fetch kegiatan data from Firestore
    const fetchKegiatanData = async () => {
      try {
        const q = query(collection(db, "lingkungans")); // Fetch only data for the specified dusun
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setKegiatanData(data);
      } catch (err) {
        setError("Failed to fetch data from Firestore.");
        console.error("Error fetching kegiatan data: ", err);
      }
    };

    fetchKegiatanData();
  }, [namadusun]); // Fetch data based on dusun

  // Fungsi untuk memotong deskripsi yang terlalu panjang
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Fungsi untuk menangani perubahan pencarian
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter kegiatan berdasarkan search term
// Filter kegiatan berdasarkan search term
const filteredKegiatan = kegiatanData.filter((kegiatan) =>
  kegiatan.title?.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div className="content">
      <h2 className="mb-4">Data Kegiatan Lingkungan Desa {namadusun}</h2>
      <Link to={`/admin/lingkungan/tambah`}>
        <Button variant="success" className="mb-3">Tambah Kegiatan</Button>
      </Link>
      {error && <p className="text-danger">{error}</p>}

      {/* Search Bar */}
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
                {kegiatan.thumbnail && (
                  <Card.Img variant="top" src={kegiatan.thumbnail} style={{ width: "600px", height: "320px", objectFit: "cover" }}

                   alt={kegiatan.title} />
                )}
                <Card.Body>
                  <Card.Title>{kegiatan.title ? kegiatan.title : "Nama kegiatan tidak diketahui"}</Card.Title>
                  <Card.Text>
                  {kegiatan.dusun.toUpperCase()}
                  </Card.Text>
                  <Card.Text>
                    {truncateText(kegiatan.description ? kegiatan.description : "Deskripsi tidak tersedia", 100)}
                  </Card.Text>
                 
                  <Link to={`/admin/lingkungan/${kegiatan.id}`}>
                    <Button variant="success" className="mr-2">Lihat Kegiatan</Button>
                  </Link>
                  <Link to={`/admin/lingkungan/${kegiatan.id}/modifikasi`}>
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
