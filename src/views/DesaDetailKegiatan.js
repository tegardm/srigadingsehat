import React from "react";
import { Card, Button } from "react-bootstrap"; // Import React Bootstrap components
import { useParams } from "react-router-dom"; // For routing params
import { Link } from "react-router-dom";

// Dummy data for example
const kegiatanDetails = {
  nama: "Posyandu Kesehatan",
  deskripsi: "Layanan kesehatan rutin yang dilaksanakan setiap bulan untuk ibu dan anak. Meliputi pemeriksaan kesehatan dasar, imunisasi, dan pemantauan gizi anak.",
  jadwal: "Setiap Hari Minggu, pukul 08:00 - 11:00 WIB",
  kontak: "CP: Ibu Rina (08123456789)",
  alamat: "Balai Desa Srigading, Jl. Desa Srigading No. 12",
  thumbnail: "https://via.placeholder.com/600x300?text=Kegiatan+Posyandu+Kesehatan" // Gambar dummy
};

function DesaDetailKegiatan() {
  const { kegiatanNama } = useParams(); // Mengambil parameter nama dari URL

  // Simulasi pengambilan data berdasarkan nama kegiatan
  const kegiatan = kegiatanDetails; // Biasanya ini bisa menggunakan logic pencarian dari database

  return (
    <div className="content">
      <h2>Detail Kegiatan: {kegiatan.nama}</h2>
      
      <Card className="mb-4">
        <Card.Img variant="top" src={kegiatan.thumbnail} alt="Kegiatan Thumbnail" />
        <Card.Body>
          <Card.Title>{kegiatan.nama}</Card.Title>
          <Card.Text>
            <strong>Deskripsi:</strong> {kegiatan.deskripsi}
          </Card.Text>
          <Card.Text>
            <strong>Jadwal:</strong> {kegiatan.jadwal}
          </Card.Text>
          <Card.Text>
            <strong>Kontak:</strong> {kegiatan.kontak}
          </Card.Text>
          <Card.Text>
            <strong>Alamat:</strong> {kegiatan.alamat}
          </Card.Text>
          <Link to="/kegiatan">
            <Button variant="primary">Kembali ke Daftar Kegiatan</Button>
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
}

export default DesaDetailKegiatan;
