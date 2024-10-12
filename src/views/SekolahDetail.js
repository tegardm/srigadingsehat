import React from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap"; // Import React Bootstrap components
import { useParams, Link } from "react-router-dom";

// Dummy data for example
const kegiatanDetails = {
  nama: "Posyandu Kesehatan",
  deskripsi: `Posyandu kesehatan adalah program kesehatan rutin yang dilakukan setiap bulan di desa Srigading. 
  Kegiatan ini meliputi pemeriksaan kesehatan dasar untuk ibu dan anak, imunisasi, pemantauan gizi, serta pemeriksaan kehamilan. 
  Tujuan utama adalah untuk memantau perkembangan kesehatan masyarakat secara berkala.`,
  jadwal: "Setiap Hari Minggu, pukul 08:00 - 11:00 WIB",
  kontak: {
    nama: "Ibu Rina",
    nomor: "628123456789" // Format nomor WA harus menggunakan kode negara, tanpa + atau spasi
  },
  alamat: "Balai Desa Srigading, Jl. Desa Srigading No. 12",
  mapsLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.8924120503376!2d110.397857!3d-7.803249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5787fa6da6f7%3A0xabd9c53545b882c!2sBalai%20Desa%20Srigading!5e0!3m2!1sen!2sid!4v1696419482644!5m2!1sen!2sid",
  thumbnail: "https://via.placeholder.com/1200x400?text=Kegiatan+Posyandu+Kesehatan",
  infoTambahan: `Kegiatan ini dilakukan dengan bekerja sama antara tenaga kesehatan desa dan kader Posyandu setempat. 
  Peserta dianjurkan untuk membawa kartu identitas dan buku KIA (Kesehatan Ibu dan Anak).`,
};

function DetailSekolah() {
  const { kegiatanNama } = useParams(); // Mengambil parameter nama dari URL

  // Menggunakan data dummy, bisa disesuaikan dengan data asli dari database
  const kegiatan = kegiatanDetails;

  return (
    <Container className="my-5 pt-5">
      {/* Header Section */}
      <h1 className="mb-4 text-center">{kegiatan.nama}</h1>

      {/* Thumbnail Section */}
      <Card className="mb-5">
        <Card.Img
          variant="top"
          src={kegiatan.thumbnail}
          alt={`Thumbnail for ${kegiatan.nama}`}
          style={{ height: "400px", objectFit: "cover" }}
        />
      </Card>

      {/* Blog Style Content */}
      <Row>
        <Col md={8} className="mx-auto">
          {/* Deskripsi Kegiatan */}
          <section className="mb-4">
            <h3>Deskripsi Kegiatan</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>{kegiatan.deskripsi}</p>
          </section>

          {/* Jadwal Kegiatan */}
          <section className="mb-4">
            <h4>Jadwal Kegiatan</h4>
            <p style={{ fontSize: "1.1rem" }}>{kegiatan.jadwal}</p>
          </section>

          {/* Informasi Tambahan */}
          <section className="mb-4">
            <h4>Informasi Tambahan</h4>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>{kegiatan.infoTambahan}</p>
          </section>

          {/* Kontak Person (hyperlink to WhatsApp) */}
          <section className="mb-4">
            <h4>Kontak Person</h4>
            <p style={{ fontSize: "1.1rem" }}>
              CP:{" "}
              <a
                href={`https://wa.me/${kegiatan.kontak.nomor}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#25D366", fontWeight: "bold" }}
              >
                {kegiatan.kontak.nama} ({kegiatan.kontak.nomor})
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
                src={kegiatan.mapsLink}
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

export default DetailSekolah;
