import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Form } from "react-bootstrap"; // Import React Bootstrap components

function SekolahList() {
  const [sekolahData, setSekolahData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State untuk pencarian
  const [error, setError] = useState(null);
  // Data Sekolah dengan Thumbnail Dummy Statis
  const sekolahSrigading = [
    {
      nama: "SDN 1 Srigading",
      deskripsi: "Sekolah dasar negeri yang terletak di pusat Desa Srigading.",
    },
    {
      nama: "SDN 2 Srigading",
      deskripsi: "Sekolah dasar negeri dengan fasilitas yang lengkap dan guru berkualitas.",
    },
    {
      nama: "SDN 3 Srigading",
      deskripsi: "Sekolah dasar yang terkenal dengan program literasi dan lingkungan hijau.",
    },
    {
      nama: "SMP 1 Lawang, Atap",
      deskripsi: "Sekolah dasar yang terkenal dengan program literasi dan lingkungan hijau.",
    },
  ];


  const dummyImage = "https://via.placeholder.com/300x200?text=Sekolah+Srigading"; // Gambar dummy statis

  useEffect(() => {
    // Simulasi pengambilan data dari Firestore
    const fetchSekolahData = async () => {
      try {
        setSekolahData(sekolahSrigading);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching sekolah data: ", err);
      }
    };

    fetchSekolahData();
  }, []);

  // Filter data sekolah berdasarkan input pencarian
  const filteredSekolahData = sekolahData.filter((sekolah) =>
    sekolah.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const {namasekolah} = useParams()
  console.log(useParams()); // Cek apakah parameternya sudah sesuai
  

  return (
    <div className="content">
      <h2>Data Sekolah Dasar Negeri di Desa Srigading</h2>
      {error && <p>Error: {error}</p>}

      {/* Input untuk pencarian sekolah */}
      <Form.Group controlId="search">
        <Form.Control
          type="text"
          placeholder="Cari Sekolah..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update state searchTerm saat ada perubahan input
        />
      </Form.Group>
        <br></br>
      <Row>
        {filteredSekolahData && filteredSekolahData.length > 0 ? (
          filteredSekolahData.map((sekolah, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card>
                {/* Thumbnail Dummy Statis */}
                <Card.Img variant="top" src={dummyImage} alt="Sekolah Srigading" />

                <Card.Body>
                  <Card.Title>{sekolah.nama ? sekolah.nama : "Nama sekolah tidak diketahui"}</Card.Title>
                  <Card.Text>
                    {sekolah.deskripsi ? sekolah.deskripsi : "Deskripsi tidak tersedia"}
                  </Card.Text>
                  <Link to={`/admin/sekolah/${namasekolah}/${sekolah.nama}`}>
                    <Button variant="success" className="mr-2">Lihat Sekolah</Button>
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
