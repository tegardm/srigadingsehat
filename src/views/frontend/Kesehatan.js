import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomNavbar from './utils/Navbar'; // Import komponen Navbar
import Footer from 'components/Footer/Footer';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Pastikan firebase diimport dengan benar

// Fungsi untuk membuat URL dinamis berdasarkan nama dusun dan kegiatan
const generateLink = (dusun, kegiatan) => {
  return `/kesehatan/${dusun.toLowerCase()}/${kegiatan.toLowerCase().replace(/\s+/g, '-')}`;
};

// Daftar nama dusun yang akan selalu ditampilkan
const DUSUN_LIST = ['mendek', 'krajan', 'gading', 'jeruk'];

const KesehatanDesa = () => {
  const [dataKesehatan, setDataKesehatan] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKesehatanData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "kesehatans"));
        const kesehatanList = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Get the document ID
          ...doc.data() // Spread the rest of the document data
        }));
  
        // Debugging: Print fetched data to console
        console.log('Fetched Kesehatan List:', kesehatanList);
  
        // Mengelompokkan data berdasarkan dusun dengan pengecekan lebih ketat
        const groupedByDusun = kesehatanList.reduce((result, current) => {
          const dusun = current.dusun ? current.dusun.toLowerCase() : null;  // Cek langsung pada field dusun
  
          console.log(`Processing dusun: ${dusun}`); // Debugging
  
          if (dusun && DUSUN_LIST.includes(dusun)) {  // Jika dusun ada dan termasuk dalam DUSUN_LIST
            if (!result[dusun]) {
              result[dusun] = [];
            }
            result[dusun].push(current);
          }
  
          return result;
        }, {});
  
        // Debugging: Print grouped data to console
        console.log('Grouped By Dusun:', groupedByDusun);
  
        setDataKesehatan(groupedByDusun);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching kesehatan data: ", err);
      }
    };
  
    fetchKesehatanData();
  }, []);
  

  return (
    <>
      <CustomNavbar />
      <div className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Kegiatan Kesehatan Desa Srigading</h2>
          {error && <p className="text-danger text-center">Error: {error}</p>}
          <Row>
            {DUSUN_LIST.map((dusun, index) => (
              <Col md={6} className="mb-4" key={index}>
                <div className="p-4 bg-white shadow rounded hover-effect">
                  <h4 className="text-success mb-3">{dusun.toUpperCase()}</h4>
                  <ListGroup>
                    {dataKesehatan[dusun]?.length > 0 ? (
                      dataKesehatan[dusun].map((kegiatan, idx) => (
                        <ListGroup.Item key={idx}>
                          <Link to={`/kesehatan/${dusun}/${kegiatan.id}`} className="text-decoration-none">
                            {kegiatan.title}
                          </Link>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <p>Tidak ada kegiatan kesehatan untuk dusun ini.</p>
                    )}
                  </ListGroup>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      <hr />

      <Footer />
    </>
  );
};

export default KesehatanDesa;
