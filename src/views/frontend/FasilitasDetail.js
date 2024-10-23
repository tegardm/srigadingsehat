import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Badge } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { db } from "../../firebase/firebase"; // Pastikan sudah ada konfigurasi firebase
import { doc, getDoc } from "firebase/firestore"; // Import fungsi Firestore
import CustomNavbar from './utils/Navbar'; // Import the Navbar component

function FasilitasDetail() {
  const { idfasilitas } = useParams(); // Mengambil parameter id dari URL
  const [fasilitas, setFasilitas] = useState(null); // State untuk menyimpan data fasilitas
  const [error, setError] = useState(null); // State untuk error
  const [loading, setLoading] = useState(true); // State untuk loading

  // Fungsi untuk mengambil data dari Firestore
  const fetchFasilitasData = async () => {
    try {
      const docRef = doc(db, "fasilitas", idfasilitas); // Referensi dokumen berdasarkan idfasilitas
      const docSnap = await getDoc(docRef); // Mendapatkan dokumen dari Firestore

      if (docSnap.exists()) {
        setFasilitas(docSnap.data()); // Mengisi state fasilitas dengan data dari Firestore
      } else {
        console.log("No such document!");
        setError("Fasilitas tidak ditemukan");
      }
    } catch (err) {
      console.error("Error fetching fasilitas:", err);
      setError("Gagal mengambil data fasilitas");
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  // Mengambil data dari Firestore saat komponen di-mount
  useEffect(() => {
    fetchFasilitasData();
  }, [idfasilitas]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!fasilitas) {
    return <p>Data fasilitas tidak tersedia</p>;
  }

  return (
    <>
      <CustomNavbar />
      <Container className="my-5 pt-5">
        {/* Header Section */}
        <h1 className="mb-4 text-center">{fasilitas.nama || "Fasilitas Tanpa Judul"}</h1>

        {/* Thumbnail Section */}
        <Card className="mb-5">
          {fasilitas.thumbnail ? (
            <Card.Img
              variant="top"
              src={fasilitas.thumbnail}
              alt={`Thumbnail for ${fasilitas.nama}`}
              style={{ height: "400px", objectFit: "cover" }}
            />
          ) : (
            <p className="text-center">Gambar tidak tersedia</p>
          )}
        </Card>

        {/* Detail Fasilitas */}
        <Row>
          <Col md={8} className="mx-auto">
            {/* Deskripsi Fasilitas */}
            <section className="mb-4">
              <h3>Deskripsi Fasilitas</h3>
              <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                {fasilitas.deskripsi || "Deskripsi tidak tersedia."}
              </p>
            </section>

            {/* Alamat Fasilitas */}
            <section className="mb-4">
              <h4>Alamat</h4>
              <p style={{ fontSize: "1.1rem" }}>{fasilitas.alamat || "Alamat tidak tersedia."}</p>
            </section>

            {/* Jam Operasional */}
            <section className="mb-4">
              <h4>Jam Operasional</h4>
              <p style={{ fontSize: "1.1rem" }}>
                <strong>Hari Buka:</strong>{" "}
                {fasilitas.jam_operasional?.hariBuka?.length
                  ? fasilitas.jam_operasional.hariBuka.map((hari, index) => (
                      <Badge key={index} pill bg="info" className="me-2">
                        {hari}
                      </Badge>
                    ))
                  : "Hari buka tidak tersedia."}
              </p>
              <p style={{ fontSize: "1.1rem" }}>
                <strong>Jam Buka:</strong> {fasilitas.jam_operasional?.waktuBuka || "Tidak tersedia"}{" "}
                - {fasilitas.jam_operasional?.waktuTutup || "Tidak tersedia"}
              </p>
            </section>

            {/* Layanan Fasilitas */}
            <section className="mb-4">
              <h4>Layanan yang Tersedia</h4>
              <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                {fasilitas.layanan?.length
                  ? fasilitas.layanan.map((layanan, index) => (
                      <Badge key={index} pill bg="success" className="me-2">
                        {layanan}
                      </Badge>
                    ))
                  : "Layanan tidak tersedia."}
              </p>
            </section>

            {/* Kontak Person (hyperlink to WhatsApp) */}
            {fasilitas.cp_petugas && (
              <section className="mb-4">
                <h4>Kontak Person</h4>
                <p style={{ fontSize: "1.1rem" }}>
                  CP:{" "}
                  <a
                    href={`https://wa.me/${fasilitas.cp_petugas}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#25D366", fontWeight: "bold" }}
                  >
                    {fasilitas.cp_petugas}
                  </a>
                </p>
              </section>
            )}

            {/* Back Button */}
            <div className="text-center mt-5">
              <Link to="/fasilitas">
                <Button variant="primary" size="lg">
                  Kembali ke Daftar Fasilitas
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default FasilitasDetail;
