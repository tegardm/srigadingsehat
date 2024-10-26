import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase/firebase'; // Import Firestore instance
import CustomNavbar from './utils/Navbar'; // Import the Navbar component
import Footer from 'components/Footer/Footer';
import { Link } from 'react-router-dom';

const KesehatanSekolah = () => {
  const [dataSekolah, setDataSekolah] = useState({});
  const [kegiatanData, setKegiatanData] = useState({}); // To store kegiatan data including names and thumbnails

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the 'sekolahs' collection
        const sekolahSnapshot = await getDocs(collection(db, "sekolahs"));
        const sekolahData = {};
        sekolahSnapshot.forEach((doc) => {
          const data = doc.data();
          const idkegiatan = data.idkegiatan;

          // Add the school document ID to the data
          const sekolahWithId = { id: doc.id, ...data };

          if (!sekolahData[idkegiatan]) {
            sekolahData[idkegiatan] = [];
          }
          sekolahData[idkegiatan].push(sekolahWithId); // Push the school data with ID
        });
        setDataSekolah(sekolahData);

        // Fetch data from 'kegiatansekolahs' to get names and thumbnails of kegiatan
        const kegiatanSnapshot = await getDocs(collection(db, "kegiatansekolahs"));
        const kegiatanDataMap = {};
        kegiatanSnapshot.forEach((doc) => {
          const kegiatanData = doc.data();
          kegiatanDataMap[doc.id] = {
            title: kegiatanData.title,
            thumbnail: kegiatanData.thumbnail // Store thumbnail by idkegiatan
          };
        });
        setKegiatanData(kegiatanDataMap);
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
                  {/* Header using kegiatan name and thumbnail */}
                  <div className="d-flex align-items-center mb-3">
                    {kegiatanData[idkegiatan]?.thumbnail && (
                      <img
                        src={kegiatanData[idkegiatan].thumbnail}
                        alt={`${kegiatanData[idkegiatan].title} thumbnail`}
                        className="me-3"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                      />
                    )}
                    <h4 className="text-primary pl-2 m-0">
                       { kegiatanData[idkegiatan]?.title || "Kegiatan Tidak Diketahui"}
                    </h4>
                  </div>
                  <ListGroup>
                    {/* Render school names */}
                    {dataSekolah[idkegiatan].map((sekolah, index) => (
                      <ListGroup.Item key={index}>
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
