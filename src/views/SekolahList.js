import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore"; // Import Firestore functions
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import icons

function SekolahList() {
  const [sekolahData, setSekolahData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [kegiatanTitle, setKegiatanTitle] = useState("");
  const { idkegiatan } = useParams();

  // Fetch data from Firestore
  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        const sekolahsRef = collection(db, "sekolahs");
        const q = query(sekolahsRef, where("idkegiatan", "==", idkegiatan));
        const querySnapshot = await getDocs(q);

        const sekolahList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSekolahData(sekolahList);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error(err);
      }
    };

    const fetchKegiatanTitle = async () => {
      try {
        const kegiatanDocRef = doc(db, "kegiatansekolahs", idkegiatan);
        const kegiatanSnap = await getDoc(kegiatanDocRef);

        if (kegiatanSnap.exists()) {
          const kegiatanData = kegiatanSnap.data();
          setKegiatanTitle(kegiatanData);
        } else {
          setError("Kegiatan not found");
        }
      } catch (err) {
        setError("Failed to load kegiatan title. Please try again.");
        console.error(err);
      }
    };

    fetchKegiatan();
    fetchKegiatanTitle();
  }, [idkegiatan]);

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

  // Function to handle deletion of a school
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this school?")) {
      try {
        const sekolahDocRef = doc(db, "sekolahs", id);
        await deleteDoc(sekolahDocRef);
        // Refresh the list after deletion
        setSekolahData(sekolahData.filter((sekolah) => sekolah.id !== id));
        alert("School deleted successfully.");
      } catch (err) {
        setError("Failed to delete school. Please try again.");
        console.error(err);
      }
    }
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

      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group controlId="search">
        <Form.Control
          type="text"
          placeholder="Cari Sekolah..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <br />
      <Row>
        {filteredSekolahData.length > 0 ? (
          filteredSekolahData.map((sekolah) => (
            <Col md={4} key={sekolah.id} className="mb-4">
              <Card>
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
                    <FontAwesomeIcon icon={faEye} />
                    </Button>
                  </Link>
                  <Link to={`/admin/sekolah/${idkegiatan}/${sekolah.id}/modifikasi`}>
                    <Button variant="warning" className="mr-2">
                    <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </Link>
                  <Button variant="danger" onClick={() => handleDelete(sekolah.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                  </Button>
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
