import React from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import CustomNavbar from "./utils/Navbar";

// Dummy data for example
const kegiatanLingkunganDetails = {
  nama: "PHBS (Prilaku Hidup Bersih dan Sehat)",
  deskripsi: `PHBS adalah upaya untuk memberdayakan anggota rumah tangga agar tahu, mau, dan mampu mempraktikkan perilaku hidup sehat. 
  Kegiatan ini meliputi sosialisasi tentang pentingnya mencuci tangan, penggunaan jamban sehat, dan menjaga kebersihan lingkungan sekitar rumah.`,
  jadwal: "Setiap Sabtu, pukul 08:00 - 11:00 WIB",
  kontak: {
    nama: "Bapak Rahman",
    nomor: "628123456789"
  },
  alamat: "Balai Dusun Mendek, Desa Srigading",
  mapsLink: "https://www.openstreetmap.org/export/embed.html?bbox=110.387857,-7.813249,110.407857,-7.793249&layer=mapnik&marker=-7.803249,110.397857",
  thumbnail: "https://via.placeholder.com/1200x400?text=Kegiatan+PHBS+Lingkungan",
  infoTambahan: `Kegiatan ini melibatkan partisipasi aktif warga dusun serta dukungan dari kader kesehatan desa. 
  Peserta diharapkan membawa peralatan pribadi seperti masker dan hand sanitizer.`,
};

function DetailLingkunganDusun() {
  const { kegiatanNama } = useParams();

  const kegiatan = kegiatanLingkunganDetails;

  return (
    <>
      <CustomNavbar />
      <Container className="my-5 pt-5">
        <h2 className="mb-4 text-center">{kegiatan.nama}</h2>

        <Card className="mb-4">
          <Card.Img
            variant="top"
            src={kegiatan.thumbnail}
            alt={`Thumbnail for ${kegiatan.nama}`}
          />
        </Card>

        <Row>
          <Col md={8} className="mx-auto">
            <section className="mb-4">
              <h5>Deskripsi</h5>
              <p>{kegiatan.deskripsi}</p>
              <p><strong>Jadwal:</strong> <br /> {kegiatan.jadwal}</p>
              <p><strong>Lokasi:</strong> <br /> {kegiatan.alamat}</p>
              <p><strong>Informasi Tambahan:</strong> <br /> {kegiatan.infoTambahan}</p>
              <p>
                <strong>Kontak:</strong> <br />
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

            <div className="mb-4">
              <iframe
                src={kegiatan.mapsLink}
                width="100%"
                height="300"
                style={{ border: "0" }}
                allowFullScreen=""
                loading="lazy"
                title="Lokasi Map"
              ></iframe>
            </div>

            <div className="text-center">
              <Link to="/lingkungan-dusun">
                <Button variant="primary">Kembali ke Daftar Kegiatan Lingkungan</Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default DetailLingkunganDusun;
