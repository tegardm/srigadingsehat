import React from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import CustomNavbar from './utils/Navbar'; // Import komponen Navbar

const dataPenduduk = [
  {
    dusun: 'Mendek',
    usia: {
      balita: 35,
      anak: 50,
      remaja: 40,
      dewasa: 150,
      lansia: 20
    }
  },
  {
    dusun: 'Krajan',
    usia: {
      balita: 45,
      anak: 60,
      remaja: 55,
      dewasa: 180,
      lansia: 30
    }
  },
  {
    dusun: 'Gading',
    usia: {
      balita: 30,
      anak: 45,
      remaja: 35,
      dewasa: 140,
      lansia: 25
    }
  },
  {
    dusun: 'Jeruk',
    usia: {
      balita: 40,
      anak: 55,
      remaja: 50,
      dewasa: 160,
      lansia: 35
    }
  }
];

const Masyarakat = () => {
  return (
    <>
    <CustomNavbar/>

<div className="py-5 bg-light">

  <Container>
    <h2 className="text-center mb-5">Informasi Masyarakat Desa Srigading</h2>
    <Row>
      {dataPenduduk.map((dusun, index) => (
        <Col md={6} className="mb-4" key={index}>
          <div className="p-4 bg-white shadow rounded">
            <h4 className="text-success mb-3">{dusun.dusun}</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Kategori Usia</th>
                  <th>Jumlah Penduduk</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Balita (0-5)</td>
                  <td>{dusun.usia.balita}</td>
                </tr>
                <tr>
                  <td>Anak (6-12)</td>
                  <td>{dusun.usia.anak}</td>
                </tr>
                <tr>
                  <td>Remaja (13-17)</td>
                  <td>{dusun.usia.remaja}</td>
                </tr>
                <tr>
                  <td>Dewasa (18-59)</td>
                  <td>{dusun.usia.dewasa}</td>
                </tr>
                <tr>
                  <td>Lansia (60+)</td>
                  <td>{dusun.usia.lansia}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Col>
      ))}
    </Row>
  </Container>
</div>
    </>
  );
};

export default Masyarakat;
