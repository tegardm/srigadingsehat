import React, { useState, useEffect } from 'react';
import { Card, Button, Form, InputGroup, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import icons

const createSlug = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

const Fasilitas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDusun, setFilterDusun] = useState('');
  const [fasilitasList, setFasilitasList] = useState([]);

  const fetchFasilitasData = async () => {
    try {
      const fasilitasCollection = collection(db, 'fasilitas');
      const fasilitasSnapshot = await getDocs(fasilitasCollection);

      const fasilitasData = fasilitasSnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          ...data,
          slug: createSlug(data.nama),
        };
      });

      setFasilitasList(fasilitasData);
    } catch (error) {
      console.error('Error fetching fasilitas data:', error);
    }
  };

  const deleteFasilitas = async (id) => {
    try {
      const docRef = doc(db, 'fasilitas', id);
      await deleteDoc(docRef);
      setFasilitasList((prevList) => prevList.filter((fasilitas) => fasilitas.id !== id));
      alert('Fasilitas berhasil dihapus');
    } catch (error) {
      console.error('Error deleting fasilitas:', error);
      alert('Gagal menghapus fasilitas. Silakan coba lagi.');
    }
  };

  useEffect(() => {
    fetchFasilitasData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterDusun(e.target.value);
  };

  const truncateDescription = (description, length) => {
    if (!description) {
      return '';
    }
    return description.split(' ').slice(0, length).join(' ') + '...';
  };

  const filteredFasilitas = fasilitasList.filter((fasilitas) => {
    const hasValidName = fasilitas.nama && fasilitas.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDusun = filterDusun === '' || fasilitas.dusun === filterDusun;
    return hasValidName && matchesDusun;
  });

  return (
    <>
      <br /><br /><br />
      <Container className="mt-4">
        <h2>Fasilitas Kesehatan di Desa Srigading</h2>
        <Row className="mb-3">
          <Col md={4}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Cari fasilitas..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Control as="select" value={filterDusun} onChange={handleFilterChange}>
              <option value="">Semua Dusun</option>
              <option value="gading">Gading</option>
              <option value="krajan">Krajan</option>
              <option value="mendek">Mendek</option>
              <option value="jeruk">Jeruk</option>
            </Form.Control>
          </Col>
          <Col md={4} className="text-right">
            <Link to='/admin/fasilitas/tambah'>
              <Button variant="primary">
                <FontAwesomeIcon icon={faPlus} /> Tambah Fasilitas
              </Button>
            </Link>
          </Col>
        </Row>

        <Row>
          {filteredFasilitas.map((fasilitas) => (
            <Col md={4} key={fasilitas.id} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  style={{ width: '500px', height: '250px', objectFit: 'cover' }}
                  src={fasilitas.thumbnail}
                  alt={fasilitas.nama}
                />
                <Card.Body>
                  <Card.Title>{fasilitas.nama}</Card.Title>
                  <Card.Text> {fasilitas.dusun.toUpperCase() || 'Tidak diketahui'}</Card.Text>
                  <Card.Text><strong>Alamat:</strong><br/> {fasilitas.alamat || 'Tidak ada alamat yang tersedia'}</Card.Text>
                  <Card.Text><strong>Deskripsi:</strong><br/> {truncateDescription(fasilitas.deskripsi, 20)}</Card.Text>

                  <Link to={`/admin/fasilitas/${fasilitas.id}`}>
                    <Button variant="info" className="mr-2">
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
                  </Link>
                  <Link to={`/admin/fasilitas/${fasilitas.id}/modifikasi`}>
                    <Button variant="warning" className="mr-2">
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (window.confirm(`Apakah Anda yakin ingin menghapus fasilitas "${fasilitas.nama}"?`)) {
                        deleteFasilitas(fasilitas.id);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
          {filteredFasilitas.length === 0 && (
            <Col>
              <p className="text-center">Tidak ada fasilitas yang ditemukan.</p>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Fasilitas;
