import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Modal } from "react-bootstrap"; // Import React Bootstrap components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import icons

function DesaKegiatan() {
  const [kegiatanData, setKegiatanData] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);

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

  const truncateText = (text, maxWords) => {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return text;
  };

  // Fungsi untuk membuka modal konfirmasi hapus
  const handleDeleteModal = (kegiatan) => {
    setSelectedKegiatan(kegiatan);
    setShowModal(true);
  };

  // Fungsi untuk menghapus data kegiatan dari Firestore
  const handleDeleteKegiatan = async () => {
    try {
      if (selectedKegiatan) {
        await deleteDoc(doc(db, "kesehatans", selectedKegiatan.id));
        setKegiatanData(kegiatanData.filter(item => item.id !== selectedKegiatan.id));
        setShowModal(false);
        setSelectedKegiatan(null);
      }
    } catch (error) {
      console.error("Error deleting kegiatan: ", error);
      setError(error.message);
    }
  };

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
                    {kegiatan.description ? truncateText(kegiatan.description, 20) : "Deskripsi tidak tersedia"}
                  </Card.Text>
                  <Link to={`/admin/desa/${namadusun}/kegiatan/${kegiatan.id}`}>
                    <Button variant="success" className="mr-2"><FontAwesomeIcon icon={faEye} /></Button>
                  </Link>
                  <Link to={`/admin/desa/${namadusun}/kegiatan/${kegiatan.id}/modifikasi`}>
                    <Button variant="warning" className="mr-2"><FontAwesomeIcon icon={faEdit} /></Button>
                  </Link>
                  <Button variant="danger" onClick={() => handleDeleteModal(kegiatan)}><FontAwesomeIcon icon={faTrash} /></Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>Data tidak tersedia.</p>
        )}
      </Row>

      {/* Modal konfirmasi hapus */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus kegiatan ini?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDeleteKegiatan}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DesaKegiatan;
