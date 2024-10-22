import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap"; // Import React Bootstrap components
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function DesaDetailKegiatan() {
  const { idkegiatan } = useParams(); // Get the idkegiatan parameter from the URL
  const [kegiatan, setKegiatan] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch the specific kegiatan document by its ID
    const fetchKegiatanData = async () => {
      try {
        const docRef = doc(db, "kesehatans", idkegiatan);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Set the kegiatan data from the document
          setKegiatan(docSnap.data());
        } else {
          // Handle case where no document exists for the given ID
          setError("Kegiatan not found.");
        }
      } catch (err) {
        setError("Error fetching kegiatan data: " + err.message);
        console.error("Error fetching kegiatan data: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKegiatanData();
  }, [idkegiatan]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!kegiatan) {
    return <p>Kegiatan data is not available.</p>;
  }

  return (
    <Container className="my-5 pt-5">
      {/* Header Section */}
      <h1 className="mb-4 text-center">{kegiatan.title || "Nama kegiatan tidak tersedia"}</h1>

      {/* Thumbnail Section */}
      <Card className="mb-5">
        <Card.Img
          variant="top"
          src={kegiatan.thumbnail || "https://via.placeholder.com/1200x400?text=Kegiatan+Posyandu+Kesehatan"}
          alt={`Thumbnail for ${kegiatan.title || "Kegiatan"}`}
          style={{ height: "400px", objectFit: "cover" }}
        />
      </Card>

      {/* Blog Style Content */}
      <Row>
        <Col md={8} className="mx-auto">
          {/* Deskripsi Kegiatan */}
          <section className="mb-4">
            <h3>Deskripsi Kegiatan</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
              {kegiatan.description || "Deskripsi tidak tersedia"}
            </p>
          </section>

          {/* Jadwal Kegiatan */}
          <section className="mb-4">
            <h4>Jadwal Kegiatan</h4>
            <p style={{ fontSize: "1.1rem" }}>{kegiatan.schedule || "Jadwal tidak tersedia"}</p>
          </section>

          {/* Informasi Tambahan */}
          <section className="mb-4">
            <h4>Informasi Tambahan</h4>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
              {kegiatan.additionalInfo || "Informasi tambahan tidak tersedia"}
            </p>
          </section>

          {/* Kontak Person (hyperlink to WhatsApp) */}
          <section className="mb-4">
            <h4>Kontak Person</h4>
            <p style={{ fontSize: "1.1rem" }}>
              CP:{" "}
              <a
                href={`https://wa.me/${kegiatan.contactPerson?.no || ""}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#25D366", fontWeight: "bold" }}
              >
                {kegiatan.contactPerson?.name || "Kontak tidak tersedia"} ({kegiatan.contactPerson?.no || "Nomor tidak tersedia"})
              </a>
            </p>
          </section>

          {/* Alamat Lokasi dan Google Maps */}
          <section className="mb-4">
            <h4>Alamat Lokasi</h4>
            <p style={{ fontSize: "1.1rem" }}>{kegiatan.locationAddress || "Alamat tidak tersedia"}</p>
            {/* Google Maps Embed */}
            <div className="map-responsive mb-4">
              <iframe
                src={kegiatan.locationGmaps || ""}
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
            <Link to="/kegiatan">
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

export default DesaDetailKegiatan;
