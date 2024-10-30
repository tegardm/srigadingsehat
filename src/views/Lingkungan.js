import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

function Lingkungan() {
  const [kegiatanData, setKegiatanData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const { namadusun } = useParams();

  useEffect(() => {
    // Fungsi untuk mengambil data kegiatan dari Firestore
    const fetchKegiatanData = async () => {
      try {
        const q = query(collection(db, "lingkungans"));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setKegiatanData(data);
      } catch (err) {
        setError("Gagal mengambil data dari Firestore.");
        console.error("Error fetching kegiatan data: ", err);
      }
    };

    fetchKegiatanData();
  }, [namadusun]);

  // Fungsi untuk memotong deskripsi yang terlalu panjang
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Fungsi untuk menangani perubahan pencarian
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Fungsi untuk menghapus kegiatan berdasarkan ID dengan konfirmasi
  const deleteKegiatan = async (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus kegiatan ini?");
    if (!confirmDelete) return; // Jika pengguna membatalkan, tidak lakukan apa-apa

    try {
      await deleteDoc(doc(db, "lingkungans", id)); // Hapus dokumen berdasarkan ID
      setKegiatanData(prevData => prevData.filter(kegiatan => kegiatan.id !== id)); // Perbarui state setelah penghapusan
    } catch (err) {
      setError("Gagal menghapus data.");
      console.error("Error deleting kegiatan: ", err);
    }
  };

  // Filter kegiatan berdasarkan search term
  const filteredKegiatan = kegiatanData.filter((kegiatan) =>
    kegiatan.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content">
      <h2 className="mb-4">Data Kegiatan Lingkungan Desa {namadusun}</h2>
      <Link to={`/admin/lingkungan/tambah`}>
        <Button variant="success" className="mb-3">
          <FontAwesomeIcon icon={faPlus} /> Tambah Kegiatan
        </Button>
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
                  <Card.Img variant="top" src={kegiatan.thumbnail} style={{ width: "600px", height: "320px", objectFit: "cover" }} alt={kegiatan.title} />
                )}
                <Card.Body>
                  <Card.Title>{kegiatan.title ? kegiatan.title : "Nama kegiatan tidak diketahui"}</Card.Title>
                  <Card.Text>{kegiatan.dusun.toUpperCase()}</Card.Text>
                  <Card.Text>{truncateText(kegiatan.description ? kegiatan.description : "Deskripsi tidak tersedia", 100)}</Card.Text>
                 
                  <Link to={`/admin/lingkungan/${kegiatan.id}`}>
                    <Button variant="success" className="mr-2"><FontAwesomeIcon icon={faEye} /></Button>
                  </Link>
                  <Link to={`/admin/lingkungan/${kegiatan.id}/modifikasi`}>
                    <Button variant="warning" className="mr-2"><FontAwesomeIcon icon={faEdit} /></Button>
                  </Link>
                  <Button variant="danger" onClick={() => deleteKegiatan(kegiatan.id)}><FontAwesomeIcon icon={faTrash} /></Button>
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
