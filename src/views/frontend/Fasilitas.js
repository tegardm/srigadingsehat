import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomNavbar from './utils/Navbar'; // Import komponen Navbar
import Footer from 'components/Footer/Footer';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Pastikan firebase diimport dengan benar

const DUSUN_LIST = ['krajan', 'gading', 'mendek', 'jeruk']; // List Dusun

const FasilitasDesa = () => {
  const [fasilitasList, setFasilitasList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDusun, setSelectedDusun] = useState(''); // Filter by dusun
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFasilitasData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'fasilitas'));
        const fasilitasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFasilitasList(fasilitasData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching fasilitas data: ', err);
      }
    };

    fetchFasilitasData();
  }, []);

  const filteredFasilitas = fasilitasList.filter(fasilitas => {
    const matchesDusun = selectedDusun ? fasilitas.dusun.toLowerCase() === selectedDusun.toLowerCase() : true;
    const matchesSearchTerm = fasilitas.nama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDusun && matchesSearchTerm;
  });

  return (
    <>
      <CustomNavbar />
      <div className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Daftar Fasilitas Desa Srigading</h2>
          {error && <p className="text-danger text-center">Error: {error}</p>}
          
          {/* Search Bar and Filter */}
          <Row className="mb-4 justify-content-center">
            <Col md={4} className="mb-3">
              <Form.Control
                type="text"
                placeholder="Cari fasilitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                as="select"
                value={selectedDusun}
                onChange={(e) => setSelectedDusun(e.target.value)}
              >
                <option value="">Semua Dusun</option>
                {DUSUN_LIST.map((dusun, idx) => (
                  <option key={idx} value={dusun}>
                    {dusun.charAt(0).toUpperCase() + dusun.slice(1)}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>

          <Row>
            {filteredFasilitas.length > 0 ? (
              filteredFasilitas.map((fasilitas, index) => (
                <Col md={4} className="mb-4" key={index}>
                  <Card className="shadow-sm hover-effect">
                    <Card.Img
                      style={{ height: '300px', objectFit: 'cover' }}
                      variant="top"
                      src={fasilitas.thumbnail}
                      alt={fasilitas.nama}
                    />
                    <Card.Body>
                      <Card.Title>{fasilitas.nama}</Card.Title>
                      <Card.Text>{fasilitas.deskripsi}</Card.Text>
                      <Link to={`/fasilitas/${fasilitas.id}`} className="btn btn-success">
                        Lihat Detail
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="text-center">Tidak ada fasilitas tersedia saat ini.</p>
            )}
          </Row>
        </Container>
      </div>
      <hr />
      <Footer />
    </>
  );
};

export default FasilitasDesa;
