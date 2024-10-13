import React from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import CustomNavbar from "./utils/Navbar";

// Dummy data for example
const kegiatanDetails = {
  nama: "Posyandu Kesehatan",
  deskripsi: `Posyandu kesehatan adalah program kesehatan rutin yang dilakukan setiap bulan di desa Srigading. 
  Kegiatan ini meliputi pemeriksaan kesehatan dasar untuk ibu dan anak, imunisasi, pemantauan gizi, serta pemeriksaan kehamilan. 
  Tujuan utama adalah untuk memantau perkembangan kesehatan masyarakat secara berkala.`,
  jadwal: "Setiap Hari Minggu, pukul 08:00 - 11:00 WIB",
  kontak: {
    nama: "Ibu Rina",
    nomor: "628123456789"
  },
  alamat: "Balai Desa Srigading, Jl. Desa Srigading No. 12",
  mapsLink: "https://www.openstreetmap.org/export/embed.html?bbox=110.387857,-7.813249,110.407857,-7.793249&layer=mapnik&marker=-7.803249,110.397857",
  thumbnail: "https://via.placeholder.com/1200x400?text=Kegiatan+Posyandu+Kesehatan",
  infoTambahan: `Kegiatan ini dilakukan dengan bekerja sama antara tenaga kesehatan desa dan kader Posyandu setempat. 
  Peserta dianjurkan untuk membawa kartu identitas dan buku KIA (Kesehatan Ibu dan Anak).`,
};

function DesaDetailKegiatan() {
  const { kegiatanNama } = useParams();

  const kegiatan = kegiatanDetails;

  return (
    <>
    <CustomNavbar/>
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
            <p><strong>Jadwal:</strong> <br></br> {kegiatan.jadwal}</p>
            <p><strong>Lokasi:</strong> <br></br> {kegiatan.alamat}</p>
            <p><strong>Informasi Tambahan:</strong> <br></br> {kegiatan.infoTambahan}</p>
            <p>
              <strong>Kontak:</strong> <br></br>
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
            <Link to="/kegiatan">
              <Button variant="primary">Kembali ke Daftar Kegiatan</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default DesaDetailKegiatan;
