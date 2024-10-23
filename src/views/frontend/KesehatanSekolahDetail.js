import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from '../../firebase/firebase'; // Firestore instance
import CustomNavbar from "./utils/Navbar";
import Footer from 'components/Footer/Footer';

function DetailKesehatanSekolah() {
  const { idsekolah } = useParams(); // Dapatkan idsekolah dari URL
  const [sekolahData, setSekolahData] = useState(null); // Data sekolah
  const [kegiatanData, setKegiatanData] = useState(null); // Data kegiatan (hanya nama)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSekolahData = async () => {
      try {
        // Ambil data sekolah berdasarkan idsekolah
        const sekolahDocRef = doc(db, "sekolahs", idsekolah);
        const sekolahDocSnap = await getDoc(sekolahDocRef);

        if (sekolahDocSnap.exists()) {
          const sekolah = sekolahDocSnap.data();
          setSekolahData(sekolah);

          // Setelah mendapatkan data sekolah, ambil data kegiatan berdasarkan idkegiatan
          const kegiatanDocRef = doc(db, "kegiatansekolahs", sekolah.idkegiatan);
          const kegiatanDocSnap = await getDoc(kegiatanDocRef);

          if (kegiatanDocSnap.exists()) {
            setKegiatanData(kegiatanDocSnap.data().title); // Ambil nama kegiatan saja
          } else {
            console.error("Kegiatan tidak ditemukan!");
          }
        } else {
          console.error("Sekolah tidak ditemukan!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSekolahData();
  }, [idsekolah]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!sekolahData) {
    return <div>Data sekolah tidak ditemukan!</div>;
  }

  return (
    <>
      <CustomNavbar />
      <Container className="my-5 pt-5">
        {/* Menampilkan detail sekolah */}
        <h3 className="font-bold text-bold mb-4 text-center"><strong>Informasi Kegiatan {kegiatanData} di {sekolahData.nama}</strong></h3>

        <Card className="mb-4">
          <Card.Img
            variant="top"
            style={{ height: "400px", objectFit: "cover" }}
            src={sekolahData.kegiatan.thumbnail}
            alt={`Thumbnail for ${sekolahData.nama}`}
          />
        </Card>

        <Row>
          <Col md={8} className="mx-auto">
            <section className="mb-4">
         
              <h5>Deskripsi</h5>
              <p>{sekolahData.kegiatan?.description || "Tidak ada deskripsi tersedia."}</p>
              <p><strong>Alamat:</strong> <br /> {sekolahData.alamat}</p>
              <p><strong>Dusun:</strong> <br /> {sekolahData.dusun}</p>
              <p>
                <strong>Kontak:</strong> <br />
                <a
                  href={`https://wa.me/${sekolahData.kegiatan?.contactPerson?.no}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#25D366", fontWeight: "bold" }}
                >
                  {sekolahData.kegiatan?.contactPerson?.name} ({sekolahData.kegiatan?.contactPerson?.no})
                </a>
              </p>
            </section>

            <div className="mb-4">
              <iframe
                src={sekolahData.kegiatan?.locationGmaps}
                width="100%"
                height="300"
                style={{ border: "0" }}
                allowFullScreen=""
                loading="lazy"
                title="Lokasi Map"
              ></iframe>
            </div>

            {/* Menampilkan nama kegiatan di bagian akhir */}
           

            <div className="text-center">
              <Link to="/kesehatan-sekolah">
                <Button variant="primary">Kembali ke Daftar Kegiatan Sekolah</Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
      <hr></hr>

      <Footer />
    </>
  );
}

export default DetailKesehatanSekolah;
