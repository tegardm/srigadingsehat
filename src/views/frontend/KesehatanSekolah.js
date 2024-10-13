import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomNavbar from './utils/Navbar'; // Import the Navbar component

// Data for school health activities
const dataKesehatanSekolah = [
  {
    sekolah: 'SDN 1 Srigading',
    kegiatan: ['Skrining Kesehatan Sekolah', 'BIAS']
  },
  {
    sekolah: 'SDN 2 Srigading',
    kegiatan: ['Skrining Kesehatan Sekolah', 'BIAS']
  },
  {
    sekolah: 'SDN 3 Srigading',
    kegiatan: ['Skrining Kesehatan Sekolah', 'BIAS']
  },
  {
    sekolah: 'SMPN 1 Lawang, Atap',
    kegiatan: ['Skrining Kesehatan Sekolah', 'BIAS']
  }
];

// Function to generate dynamic URL based on the school and activity
const generateLink = (sekolah, kegiatan) => {
  return `/kesehatan-sekolah/${sekolah.toLowerCase().replace(/\s+/g, '-')}/${kegiatan.toLowerCase().replace(/\s+/g, '-')}`;
};

const KesehatanSekolah = () => {
  return (
    <>
      <CustomNavbar />
      <div className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Kegiatan Kesehatan Sekolah di Desa Srigading</h2>
          <Row>
            {dataKesehatanSekolah.map((sekolahData, index) => (
              <Col md={6} className="mb-4" key={index}>
                <div className="p-4 bg-white shadow rounded hover-effect">
                  <h4 className="text-primary mb-3">{sekolahData.sekolah}</h4>
                  <ListGroup>
                    {sekolahData.kegiatan.map((kegiatan, idx) => (
                      <ListGroup.Item key={idx}>
                        <Link to={generateLink(sekolahData.sekolah, kegiatan)} className="text-decoration-none">
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

export default KesehatanSekolah;
