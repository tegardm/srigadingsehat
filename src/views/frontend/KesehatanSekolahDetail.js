import React from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import CustomNavbar from "./utils/Navbar";

// Dummy data for example
const kegiatanSekolahDetails = {
  nama: "Skrining Kesehatan Sekolah",
  deskripsi: `Skrining Kesehatan Sekolah adalah program kesehatan rutin yang dilakukan di sekolah-sekolah di desa Srigading.
  Kegiatan ini meliputi pemeriksaan kesehatan dasar untuk siswa seperti pemeriksaan gigi, pengukuran berat badan, dan tinggi badan.
  Tujuan utama adalah untuk memantau kesehatan siswa secara berkala dan mendeteksi dini masalah kesehatan.`,
  jadwal: "Setiap Hari Rabu, pukul 09:00 - 12:00 WIB",
  kontak: {
    nama: "Ibu Sari",
    nomor: "628987654321"
  },
  alamat: "SDN 1 Srigading, Jl. Pendidikan No. 5",
  mapsLink: "https://www.openstreetmap.org/export/embed.html?bbox=110.387857,-7.813249,110.407857,-7.793249&layer=mapnik&marker=-7.803249,110.397857",
  thumbnail: "https://via.placeholder.com/1200x400?text=Kegiatan+Skrining+Kesehatan+Sekolah",
  infoTambahan: `Kegiatan ini dilaksanakan oleh tim kesehatan desa dengan bantuan dari guru dan tenaga kesehatan sekolah. 
  Siswa diminta untuk membawa kartu identitas siswa dan buku kesehatan bila ada.`,
};

function DetailKesehatanSekolah() {
  const { kegiatanNama } = useParams();

  const kegiatan = kegiatanSekolahDetails;

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
              <Link to="/kegiatan-sekolah">
                <Button variant="primary">Kembali ke Daftar Kegiatan Sekolah</Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default DetailKesehatanSekolah;
