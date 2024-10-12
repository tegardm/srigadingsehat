import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap"; // Import komponen dari React Bootstrap

function Kelahiran() {
  const [dusunData, setDusunData] = useState([]);
  const [error, setError] = useState(null);

  // Thumbnail Dummy Statis
  const dummyThumbnail = "https://via.placeholder.com/300x200?text=Thumbnail+Dusun";

  // Fetch data from Firestore
  useEffect(() => {
    const fetchDusunData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "dusuns"));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setDusunData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching dusun data: ", err);
      }
    };

    fetchDusunData();
  }, []);

  return (
    <div className="content">
      <h2>Data Kependudukan Masyarakat Desa Srigading</h2>
      {error && <p>Error: {error}</p>}
      
      <Row>
        {dusunData && dusunData.length > 0 ? (
          dusunData.map((dusun, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card>
                {/* Thumbnail Dummy */}
                <Card.Img variant="top" src={dummyThumbnail} alt="Thumbnail Dusun" />

                <Card.Body>
                  <Card.Title>{dusun.nama ? dusun.nama : "Tidak diketahui"}</Card.Title>
                  <Card.Text>
                    <strong>Jumlah Penduduk:</strong> {dusun.jumlah_penduduk ? dusun.jumlah_penduduk : "N/A"}
                  </Card.Text>
                  <Card.Text>
                    <strong>Alamat:</strong> {dusun.alamat ? dusun.alamat : "Alamat tidak tersedia"}
                  </Card.Text>
                  <Link to={`/admin/penduduk/${dusun.nama}`}>
                    <Button variant="success" className="mr-2">Show</Button>
                  </Link>
                  <Link to={`/admin/penduduk/${dusun.nama}/modifikasi`}>
                    <Button variant="warning">Modifikasi</Button>
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

export default Kelahiran;
