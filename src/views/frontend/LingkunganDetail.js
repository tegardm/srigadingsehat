import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { db } from "../../firebase/firebase"; // Pastikan sudah ada konfigurasi firebase
import { doc, getDoc } from "firebase/firestore"; // Import fungsi Firestore
import CustomNavbar from './utils/Navbar'; // Import the Navbar component

function LingkunganDetail() {
  const { idlingkungan } = useParams(); // Mengambil parameter id dari URL
  const [kegiatan, setKegiatan] = useState(null); // State untuk menyimpan data kegiatan
  const [error, setError] = useState(null); // State untuk error
  const [loading, setLoading] = useState(true); // State untuk loading

  // Fungsi untuk mengambil data dari Firestore
  const fetchKegiatanData = async () => {
    try {
      const docRef = doc(db, "lingkungans", idlingkungan); // Referensi dokumen berdasarkan idlingkungan
      const docSnap = await getDoc(docRef); // Mendapatkan dokumen dari Firestore

      if (docSnap.exists()) {
        setKegiatan(docSnap.data()); // Mengisi state kegiatan dengan data dari Firestore
      } else {
        console.log("No such document!");
        setError("Kegiatan tidak ditemukan");
      }
    } catch (err) {
      console.error("Error fetching kegiatan:", err);
      setError("Gagal mengambil data kegiatan");
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  // Mengambil data dari Firestore saat komponen di-mount
  useEffect(() => {
    fetchKegiatanData();
  }, [idlingkungan]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!kegiatan) {
    return <p>Data kegiatan tidak tersedia</p>;
  }

  return (
    <>
    <CustomNavbar/>
      <Container className="my-5 pt-5">
        {/* Header Section */}
        <h1 className="mb-4 text-center">{kegiatan.title || "Kegiatan Tanpa Judul"}</h1>

        {/* Thumbnail Section */}
        <Card className="mb-5">
          {kegiatan.thumbnail ? (
            <Card.Img
              variant="top"
              src={kegiatan.thumbnail}
              alt={`Thumbnail for ${kegiatan.title}`}
              style={{ height: "400px", objectFit: "cover" }}
            />
          ) : (
            <p className="text-center">Gambar tidak tersedia</p>
          )}
        </Card>

        {/* Blog Style Content */}
        <Row>
          <Col md={8} className="mx-auto">
            {/* Deskripsi Kegiatan */}
            <section className="mb-4">
              <h3>Deskripsi Kegiatan</h3>
              <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                {kegiatan.description || "Deskripsi tidak tersedia."}
              </p>
            </section>

            {/* Jadwal Kegiatan */}
            <section className="mb-4">
              <h4>Jadwal Kegiatan</h4>
              <p style={{ fontSize: "1.1rem" }}>{kegiatan.schedule || "Jadwal tidak tersedia."}</p>
            </section>

            {/* Informasi Tambahan */}
            <section className="mb-4">
              <h4>Informasi Tambahan</h4>
              <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                {kegiatan.additionalInfo || "Informasi tambahan tidak tersedia."}
              </p>
            </section>

            {/* Kontak Person (hyperlink to WhatsApp) */}
            {kegiatan.contactPerson && kegiatan.contactPerson.no && (
              <section className="mb-4">
                <h4>Kontak Person</h4>
                <p style={{ fontSize: "1.1rem" }}>
                  CP:{" "}
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
            )}

            {/* Alamat Lokasi dan Google Maps */}
            <section className="mb-4">
              <h4>Alamat Lokasi</h4>
              <p style={{ fontSize: "1.1rem" }}>{kegiatan.locationAddress || "Alamat tidak tersedia."}</p>
              {/* Google Maps Embed */}
              {kegiatan.locationGmaps && (
                <div className="map-responsive mb-4">
                  <iframe
                    src={kegiatan.locationGmaps}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps Lokasi"
                  ></iframe>
                </div>
              )}
            </section>

            {/* Back Button */}
            <div className="text-center mt-5">
              <Link to="/lingkungan">
                <Button variant="primary" size="lg">
                  Kembali ke Daftar Kegiatan
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default LingkunganDetail;
