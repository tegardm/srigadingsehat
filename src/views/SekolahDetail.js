import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap"; // Import React Bootstrap components
import { useParams, Link } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore"; // Import Firestore
import { db } from "../firebase/firebase"; // Import Firebase instance

function DetailSekolah() {
  const { idsekolah } = useParams(); // Mengambil parameter idsekolah dari URL
  const [kegiatan, setKegiatan] = useState(null); // State untuk menyimpan data kegiatan
  const [loading, setLoading] = useState(true); // State untuk loading

  useEffect(() => {
    const fetchKegiatanData = async () => {
      try {
        // Ambil data sekolah dari Firestore berdasarkan idsekolah
        const docRef = doc(db, "sekolahs", idsekolah);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Jika dokumen ada, simpan data ke state
          setKegiatan(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false); // Set loading ke false setelah proses selesai
      }
    };

    fetchKegiatanData();
  }, [idsekolah]); // Trigger useEffect saat idsekolah berubah

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!kegiatan) {
    return <p>Data kegiatan tidak ditemukan.</p>;
  }

  return (
    <Container className="my-5 pt-5">
      {/* Header Section */}
      <h2 className="mb-4 text-center"><strong>{kegiatan.kegiatan.title} di {kegiatan.nama}</strong></h2>

      {/* Thumbnail Section */}
      <Card className="mb-5">
        <Card.Img
          variant="top"
          src={kegiatan.kegiatan.thumbnail}
          alt={`Thumbnail for ${kegiatan.kegiatan.title}`}
          style={{ height: "400px", objectFit: "cover" }}
        />
      </Card>

      {/* Blog Style Content */}
      <Row>
        <Col md={8} className="mx-auto">
          {/* Deskripsi Kegiatan */}
          <section className="mb-4">
            <h3>Deskripsi Kegiatan</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>{kegiatan.kegiatan.description}</p>
          </section>

          {/* Jadwal Kegiatan */}
          <section className="mb-4">
            <h4>Jadwal Kegiatan</h4>
            <p style={{ fontSize: "1.1rem" }}>{kegiatan.kegiatan.schedule}</p>
          </section>

          {/* Informasi Tambahan */}
          <section className="mb-4">
            <h4>Informasi Tambahan</h4>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>{kegiatan.kegiatan.additionalInfo}</p>
          </section>

          {/* Kontak Person (hyperlink to WhatsApp) */}
          <section className="mb-4">
            <h4>Kontak Person</h4>
            <p style={{ fontSize: "1.1rem" }}>
              CP:{" "}
              <a
                href={`https://wa.me/${kegiatan.kegiatan.contactPerson.no}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#25D366", fontWeight: "bold" }}
              >
                {kegiatan.kegiatan.contactPerson.name} ({kegiatan.kegiatan.contactPerson.no})
              </a>
            </p>
          </section>

          {/* Alamat Lokasi dan Google Maps */}
          <section className="mb-4">
            <h4>Alamat Lokasi</h4>
            <p style={{ fontSize: "1.1rem" }}>{kegiatan.alamat}</p>
            {/* Google Maps Embed */}
            <div className="map-responsive mb-4">
              <iframe
                src={kegiatan.kegiatan.locationGmaps}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Lokasi"
              ></iframe>
            </div>
          </section>

          {/* Back Button */}
          <div className="text-center mt-5">
            <Link to="/admin/sekolah">
              <Button variant="primary" size="lg">
                Kembali ke Daftar Kegiatan
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default DetailSekolah;
