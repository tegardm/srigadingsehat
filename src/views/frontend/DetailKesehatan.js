import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import CustomNavbar from "./utils/Navbar";
import Footer from 'components/Footer/Footer';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Import your Firebase configuration

function DesaDetailKegiatan() {
  const { idkegiatan } = useParams(); // Use the idkegiatan parameter
  const [kegiatan, setKegiatan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKegiatanData = async () => {
      try {
        const docRef = doc(db, "kesehatans", idkegiatan); // Reference the document using idkegiatan
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setKegiatan({ id: docSnap.id, ...docSnap.data() }); // Include the document ID
        } else {
          setError("Kegiatan tidak ditemukan");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKegiatanData();
  }, [idkegiatan]);

  if (loading) {
    return <p>Loading...</p>; // Show a loading message while fetching data
  }

  if (error) {
    return <p className="text-danger">{error}</p>; // Show an error message if any error occurs
  }

  return (
    <>
      <CustomNavbar />
      <Container className="my-5 pt-5">
        <h2 className="mb-4 text-center">{kegiatan.title}</h2>

        <Card className="mb-4">
          <Card.Img
            variant="top"
            src={kegiatan.thumbnail}
            alt={`Thumbnail for ${kegiatan.title}`}
            style={{ height: "400px", objectFit: "cover" }}
          />
        </Card>

        <Row>
          <Col md={8} className="mx-auto">
            <section className="mb-4">
              <h5>Deskripsi</h5>
              <p>{kegiatan.description}</p>
              <p><strong>Jadwal:</strong> <br /> {kegiatan.schedule}</p>
              
              <p><strong>Informasi Tambahan:</strong> <br /> {kegiatan.additionalInfo}</p>
              <p>
                <strong>Kontak:</strong> <br />
                <a
                  href={`https://wa.me/${kegiatan.contactPerson.no}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#25D366", fontWeight: "bold" }}
                >
                  {kegiatan.contactPerson.name} ({kegiatan.contactPerson.no})
                </a>
              </p>
            </section>

            <div className="mb-4">
              <iframe
                src={kegiatan.locationGmaps}
                width="100%"
                height="300"
                style={{ border: "0" }}
                allowFullScreen=""
                loading="lazy"
                title="Lokasi Map"
              ></iframe>
            </div>

            <div className="text-center">
              <Link to="/kegiatan">
                <Button variant="primary">Kembali ke Daftar Kegiatan</Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
      <hr />

      <Footer />
    </>
  );
}

export default DesaDetailKegiatan;
