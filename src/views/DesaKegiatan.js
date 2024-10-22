import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap"; // Import React Bootstrap components

function DesaKegiatan() {
  const [kegiatanData, setKegiatanData] = useState([]);
  const [error, setError] = useState(null);

  const { namadusun } = useParams();

  useEffect(() => {
    // Fetch data from Firestore collection "kesehatans" and filter by "namadusun"
    const fetchKegiatanData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "kesehatans"));
        const data = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(kegiatan => kegiatan.dusun === namadusun); // Filter by dusun

        setKegiatanData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching kegiatan data: ", err);
      }
    };

    fetchKegiatanData();
  }, [namadusun]);

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
                <Card.Img
                  variant="top"
                  src={kegiatan.thumbnail ? kegiatan.thumbnail : "https://via.placeholder.com/300x200?text=Kegiatan+Kesehatan"}
                  alt="Kegiatan Kesehatan"
                  style={{ width: '500px', height: '250px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{kegiatan.title ? kegiatan.title : "Nama kegiatan tidak diketahui"}</Card.Title>
                  <Card.Text>
                    {kegiatan.description ? kegiatan.description : "Deskripsi tidak tersedia"}
                  </Card.Text>
                  <Link to={`/admin/desa/${namadusun}/kegiatan/${kegiatan.id}`}>
                    <Button variant="success" className="mr-2">Lihat Kegiatan</Button>
                  </Link>
                  <Link to={`/admin/desa/${namadusun}/kegiatan/${kegiatan.id}/modifikasi`}>
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
