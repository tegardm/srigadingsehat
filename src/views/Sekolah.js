import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap"; // Import React Bootstrap components

function Sekolah() {
  const [kegiatanData, setKegiatanData] = useState([]);
  const [error, setError] = useState(null);

  const { namadusun } = useParams();

  useEffect(() => {
    // Fetch data from Firestore
    const fetchKegiatanData = async () => {
      try {
        const kegiatanCollection = collection(db, "kegiatansekolahs");
        const kegiatanSnapshot = await getDocs(kegiatanCollection);
        const kegiatanList = kegiatanSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setKegiatanData(kegiatanList);
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
                {/* Display thumbnail if available, otherwise use a placeholder */}
                <Card.Img 
                  variant="top"  style={{ width: '600px', height: '300px', objectFit: 'cover' }}
                  src={kegiatan.thumbnail || "https://via.placeholder.com/300x200?text=Kegiatan+Kesehatan+Sekolah"} 
                  alt="Kegiatan Kesehatan Sekolah" 
                />
                <Card.Body>
                  <Card.Title>{kegiatan.title || "Nama kegiatan tidak diketahui"}</Card.Title>
                  <Card.Text>
                    {kegiatan.description || "Deskripsi tidak tersedia"}
                  </Card.Text>
                  <Link to={`/admin/sekolah/${kegiatan.id}`}>
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
