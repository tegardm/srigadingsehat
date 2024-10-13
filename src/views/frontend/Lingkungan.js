import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomNavbar from './utils/Navbar'; // Import the Navbar component

// Data for environmental activities in each hamlet
const dataLingkunganDusun = [
  {
    dusun: 'Mendek',
    kegiatan: ['PHBS (Prilaku Hidup Bersih dan Sehat)']
  },
  {
    dusun: 'Krajan',
    kegiatan: ['PHBS (Prilaku Hidup Bersih dan Sehat)']
  },
  {
    dusun: 'Gading',
    kegiatan: ['PHBS (Prilaku Hidup Bersih dan Sehat)']
  },
  {
    dusun: 'Jeruk',
    kegiatan: ['PHBS (Prilaku Hidup Bersih dan Sehat)']
  }
];

// Function to create dynamic URLs based on the hamlet name and activity
const generateLink = (dusun, kegiatan) => {
  return `/lingkungan/${dusun.toLowerCase()}/${kegiatan.toLowerCase().replace(/\s+/g, '-')}`;
};

const LingkunganDesa = () => {
  return (
    <>
      <CustomNavbar />
      <div className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Kegiatan Lingkungan Desa Srigading</h2>
          <Row>
            {dataLingkunganDusun.map((dusunData, index) => (
              <Col md={6} className="mb-4" key={index}>
                <div className="p-4 bg-white shadow rounded hover-effect">
                  <h4 className="text-success mb-3">{dusunData.dusun}</h4>
                  <ListGroup>
                    {dusunData.kegiatan.map((kegiatan, idx) => (
                      <ListGroup.Item key={idx}>
                        <Link to={generateLink(dusunData.dusun, kegiatan)} className="text-decoration-none">
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
    </>
  );
};

export default LingkunganDesa;
