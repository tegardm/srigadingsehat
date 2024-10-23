import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"; // Import Firestore functions

function SekolahList() {
  const [sekolahData, setSekolahData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [error, setError] = useState(null);
  const [kegiatanTitle, setKegiatanTitle] = useState(""); // State for kegiatan title
  const { idkegiatan, idsekolah } = useParams(); // Use params from URL

  // Fetch data from Firestore
  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        // Query the 'sekolahs' collection where 'idkegiatan' field matches the given idkegiatan
        const sekolahsRef = collection(db, "sekolahs");
        const q = query(sekolahsRef, where("idkegiatan", "==", idkegiatan));
        const querySnapshot = await getDocs(q);

        // Map over the query results and extract the data
        const sekolahList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update the state with the fetched data
        setSekolahData(sekolahList);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error(err);
      }
    };

    const fetchKegiatanTitle = async () => {
      try {
        // Get the kegiatan document by idkegiatan
        const kegiatanDocRef = doc(db, "kegiatansekolahs", idkegiatan);
        const kegiatanSnap = await getDoc(kegiatanDocRef);

        if (kegiatanSnap.exists()) {
          const kegiatanData = kegiatanSnap.data();
          setKegiatanTitle(kegiatanData); // Set title from kegiatan data
        } else {
          setError("Kegiatan not found");
        }
      } catch (err) {
        setError("Failed to load kegiatan title. Please try again.");
        console.error(err);
      }
    };

    fetchKegiatan();
    fetchKegiatanTitle(); // Fetch title on component load
  }, [idkegiatan]); // Rerun the effect when idkegiatan changes

  // Filter data based on search input
  const filteredSekolahData = sekolahData.filter((sekolah) =>
    sekolah.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (text, maxWords) => {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return text;
  };

  return (
    <div className="content">
      <h3><strong>Data Sekolah untuk Kegiatan {kegiatanTitle.title || "Loading..."}</strong></h3>
      <p>{kegiatanTitle.description}</p>
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
                  src={sekolah.kegiatan.thumbnail || "https://via.placeholder.com/300x200?text=Sekolah+Srigading"}
                  alt={sekolah.nama}
                  style={{ width: "500px", height: "250px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{sekolah.nama || "Nama sekolah tidak diketahui"}</Card.Title>
                  <Card.Text>{truncateText(sekolah.kegiatan.description, 15)}</Card.Text>
                  <Link to={`/admin/sekolah/${idkegiatan}/${sekolah.id}`}>
                    <Button variant="success" className="mr-2">
                      Lihat Kegiatan
                    </Button>
                  </Link>
                  <Link to={`/admin/sekolah/${idkegiatan}/${sekolah.id}/modifikasi`}>
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
