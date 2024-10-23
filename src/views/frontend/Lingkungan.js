import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomNavbar from './utils/Navbar'; // Import the Navbar component
import Footer from 'components/Footer/Footer';
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions
import { db } from '../../firebase/firebase'; // Firebase configuration

// Function to create dynamic URLs based on the document ID
const generateLink = (id) => {
  return `/lingkungan/detail/${id}`; // Link menggunakan id dokumen
};

const LingkunganDesa = () => {
  const [dataLingkunganDusun, setDataLingkunganDusun] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching data from Firestore
    const fetchKegiatanData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'lingkungans'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Menyimpan id dokumen
          dusun: doc.data().dusun,
          kegiatan: doc.data().title ? [doc.data().title] : [], // Assuming each doc has a title field as kegiatan
        }));

        setDataLingkunganDusun(data);
      } catch (err) {
        setError('Failed to fetch data from Firestore.');
        console.error('Error fetching data: ', err);
      }
    };

    fetchKegiatanData();
  }, []);

  return (
    <>
      <CustomNavbar />
      <div className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Kegiatan Lingkungan Desa Srigading</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          <Row>
            {dataLingkunganDusun.map((dusunData, index) => (
              <Col md={6} className="mb-4" key={index}>
                <div className="p-4 bg-white shadow rounded hover-effect">
                  <h4 className="text-success mb-3">{dusunData.dusun.toUpperCase()}</h4>
                  <ListGroup>
                    {dusunData.kegiatan.map((kegiatan, idx) => (
                      <ListGroup.Item key={idx}>
                        <Link to={`/lingkungan/${dusunData.id}`} className="text-decoration-none">
                          {kegiatan}
                        </Link>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      <hr></hr>
      <Footer/>
    </>
  );
};

export default LingkunganDesa;
