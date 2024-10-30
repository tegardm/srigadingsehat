import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap"; // Import React Bootstrap components

function Desa() {
  const [dusunData, setDusunData] = useState([]);
  const [error, setError] = useState(null);

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
      <h2 className="text-center my-4">Informasi Kesehatan Desa Srigading</h2>
      {error && <p className="text-danger">Error: {error}</p>}
      
      <Row>
        {dusunData && dusunData.length > 0 ? (
          dusunData.map((dusun, index) => (
            <Col md={4} sm={6} xs={12} key={index} className="mb-4">
              <Card className="shadow-sm">
                {/* Thumbnail Section */}
                <Card.Img
                  variant="top"
                  src={dusun.gambar ? dusun.gambar : "https://via.placeholder.com/350x200?text=Desa+Srigading"}
                  alt="Thumbnail"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                
                {/* Card Content */}
                <Card.Body>
                  <Card.Title className="text-center">
                  {dusun.nama ? dusun.nama.toUpperCase() : "Nama Desa Tidak Diketahui"}
                  </Card.Title>
                  <Card.Text className="text-muted text-center  ">
                    {dusun.alamat ? dusun.alamat : "Alamat tidak tersedia"}
                  </Card.Text>
                  <div className="text-center">
                    <Link to={`/admin/penduduk/${dusun.nama}`}>
                      <Button variant="success" className="btn-block">Lihat Kegiatan</Button>
                    </Link>
                    <Link to={`/admin/desa/${dusun.nama}/modifikasi`}>
                      <Button variant="warning" className="btn-block">Modifikasi Dusun</Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center w-100">Data tidak tersedia.</p>
        )}
      </Row>
    </div>
  );
}

export default Desa;
