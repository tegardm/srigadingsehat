import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomNavbar from './utils/Navbar'; // Import komponen Navbar

// Data kegiatan kesehatan setiap dusun
const dataKesehatanDusun = [
  {
    dusun: 'Mendek',
    kegiatan: ['Krening Kesehatan', 'Pemeriksaan Hamil', 'Imunisasi Dasar', 'Pemantauan Gizi Anak', 'Stunting', 'DDTK']
  },
  {
    dusun: 'Krajan',
    kegiatan: ['Krening Kesehatan', 'Pemeriksaan Hamil', 'Imunisasi Dasar', 'Pemantauan Gizi Anak', 'Stunting', 'DDTK']
  },
  {
    dusun: 'Gading',
    kegiatan: ['Krening Kesehatan', 'Pemeriksaan Hamil', 'Imunisasi Dasar', 'Pemantauan Gizi Anak', 'Stunting', 'DDTK']
  },
  {
    dusun: 'Jeruk',
    kegiatan: ['Krening Kesehatan', 'Pemeriksaan Hamil', 'Imunisasi Dasar', 'Pemantauan Gizi Anak', 'Stunting', 'DDTK']
  }
];

// Fungsi untuk membuat URL dinamis berdasarkan nama dusun dan kegiatan
const generateLink = (dusun, kegiatan) => {
  return `/kesehatan/${dusun.toLowerCase()}/${kegiatan.toLowerCase().replace(/\s+/g, '-')}`;
};

const KesehatanDesa = () => {
  return (
    <>
      <CustomNavbar />
      <div className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Kegiatan Kesehatan Desa Srigading</h2>
          <Row>
            {dataKesehatanDusun.map((dusunData, index) => (
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

export default KesehatanDesa;
