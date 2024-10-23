import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase/firebase'; // Import Firestore instance
import CustomNavbar from './utils/Navbar'; // Import the Navbar component
import Footer from 'components/Footer/Footer';
import { Link } from 'react-router-dom';

const KesehatanSekolah = () => {
  const [dataSekolah, setDataSekolah] = useState({});
  const [kegiatanNames, setKegiatanNames] = useState({}); // To store kegiatan names by idkegiatan

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the 'sekolahs' collection
        const sekolahSnapshot = await getDocs(collection(db, "sekolahs"));
        const sekolahData = {};
        sekolahSnapshot.forEach((doc) => {
          const data = doc.data();
          const idkegiatan = data.idkegiatan;

          // Tambahkan id dokumen sekolah ke dalam data
          const sekolahWithId = { id: doc.id, ...data };

          if (!sekolahData[idkegiatan]) {
            sekolahData[idkegiatan] = [];
          }
          sekolahData[idkegiatan].push(sekolahWithId); // Push sekolah dengan id
        });
        setDataSekolah(sekolahData);

        // Fetch data from 'kegiatansekolahs' to get names of kegiatan
        const kegiatanSnapshot = await getDocs(collection(db, "kegiatansekolahs"));
        const kegiatanNamesData = {};
        kegiatanSnapshot.forEach((doc) => {
          const kegiatanData = doc.data();
          kegiatanNamesData[doc.id] = kegiatanData.title; // Store title by idkegiatan
        });
        setKegiatanNames(kegiatanNamesData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <CustomNavbar />
      <div className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Kegiatan Kesehatan Sekolah di Desa Srigading</h2>
          <Row>
            {Object.keys(dataSekolah).map((idkegiatan) => (
              <Col md={6} className="mb-4" key={idkegiatan}>
                <div className="p-4 bg-white shadow rounded hover-effect">
                  {/* Header menggunakan nama kegiatan */}
                  <h4 className="text-primary mb-3">
                    {kegiatanNames[idkegiatan] || "Kegiatan Tidak Diketahui"}
                  </h4>
                  <ListGroup>
                    {/* Render nama sekolah */}
                    {dataSekolah[idkegiatan].map((sekolah, index) => (
                      <ListGroup.Item key={index}>
                        {/* Nama sekolah sebagai list item */}
                        <Link to={`/kesehatan-sekolah/${sekolah.id}`}>{sekolah.nama}</Link> 
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default KesehatanSekolah;
