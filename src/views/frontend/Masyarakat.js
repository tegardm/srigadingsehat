import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import CustomNavbar from './utils/Navbar'; // Import komponen Navbar
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Footer from 'components/Footer/Footer';

// Fungsi untuk mengklasifikasikan usia ke dalam kategori
const classifyByAge = (usia) => {
  if (usia <= 5) return 'balita';
  if (usia <= 12) return 'anak';
  if (usia <= 17) return 'remaja';
  if (usia <= 59) return 'dewasa';
  return 'lansia';
};

const Masyarakat = () => {
  const [dusunData, setDusunData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendudukData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "penduduks"));
        const pendudukList = querySnapshot.docs.map((doc) => doc.data());

        // Inisialisasi struktur data untuk setiap dusun
        const dusunStats = {
          krajan: { balita: 0, anak: 0, remaja: 0, dewasa: 0, lansia: 0 },
          gading: { balita: 0, anak: 0, remaja: 0, dewasa: 0, lansia: 0 },
          mendek: { balita: 0, anak: 0, remaja: 0, dewasa: 0, lansia: 0 },
          jeruk: { balita: 0, anak: 0, remaja: 0, dewasa: 0, lansia: 0 },
        };

        // Loop melalui data penduduk dan klasifikasikan berdasarkan dusun dan usia
        pendudukList.forEach(penduduk => {
          const usiaKategori = classifyByAge(penduduk.usia); // Klasifikasikan usia
          const dusun = penduduk.dusun; // Ambil nama dusun

          if (dusunStats[dusun]) {
            dusunStats[dusun][usiaKategori] += 1; // Tambahkan jumlah di kategori usia yang sesuai
          }
        });

        setDusunData(dusunStats);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching dusun data: ", err);
      }
    };

    fetchPendudukData();
  }, []);

  return (
    <>
      <CustomNavbar />
      <div className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Informasi Masyarakat Desa Srigading</h2>
          {error && <p className="text-danger text-center">Error: {error}</p>}
          <Row>
            {Object.entries(dusunData).map(([dusun, data], index) => (
              <Col md={6} className="mb-4" key={index}>
                <div className="p-4 bg-white shadow rounded">
                  <h4 className="text-success mb-3">{dusun.toUpperCase()}</h4>
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
                        <td>{data.balita}</td>
                      </tr>
                      <tr>
                        <td>Anak (6-12)</td>
                        <td>{data.anak}</td>
                      </tr>
                      <tr>
                        <td>Remaja (13-17)</td>
                        <td>{data.remaja}</td>
                      </tr>
                      <tr>
                        <td>Dewasa (18-59)</td>
                        <td>{data.dewasa}</td>
                      </tr>
                      <tr>
                        <td>Lansia (60+)</td>
                        <td>{data.lansia}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      <hr></hr>

      <Footer />
    </>
  );
};

export default Masyarakat;
