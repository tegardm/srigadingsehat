import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import CustomNavbar from './utils/Navbar'; // Import komponen Navbar
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const dummyPenduduk = {
  balita: 35,
  anak: 50,
  remaja: 40,
  dewasa: 150,
  lansia: 20
};

const Masyarakat = () => {
  const [dusunData, setDusunData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDusunData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "dusuns"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setDusunData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching dusun data: ", err);
      }
    };

    fetchDusunData();
  }, []);

  return (
    <>
      <CustomNavbar />
      <div className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Informasi Masyarakat Desa Srigading</h2>
          {error && <p className="text-danger text-center">Error: {error}</p>}
          <Row>
            {dusunData.map((dusun, index) => (
              <Col md={6} className="mb-4" key={index}>
                <div className="p-4 bg-white shadow rounded">
                  <h4 className="text-success mb-3">{dusun.nama.toUpperCase()|| 'Nama tidak tersedia'}</h4>
                  <p>{dusun.alamat}</p>
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
                        <td>{dummyPenduduk.balita}</td>
                      </tr>
                      <tr>
                        <td>Anak (6-12)</td>
                        <td>{dummyPenduduk.anak}</td>
                      </tr>
                      <tr>
                        <td>Remaja (13-17)</td>
                        <td>{dummyPenduduk.remaja}</td>
                      </tr>
                      <tr>
                        <td>Dewasa (18-59)</td>
                        <td>{dummyPenduduk.dewasa}</td>
                      </tr>
                      <tr>
                        <td>Lansia (60+)</td>
                        <td>{dummyPenduduk.lansia}</td>
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
