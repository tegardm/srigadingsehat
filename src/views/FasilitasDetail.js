import React from 'react';
import { Container, Card, ListGroup, Row, Col } from 'react-bootstrap';

// Dummy data untuk fasilitas kesehatan
const fasilitas = {
    nama: "Puskesmas Srigading",
    alamat: "Jl. Raya No.123, Desa Srigading",
    cp_petugas: "0812-3456-7890",
    deskripsi: "Puskesmas Srigading menyediakan berbagai layanan kesehatan masyarakat termasuk pengobatan umum, imunisasi, dan pemeriksaan kesehatan. Dengan tenaga medis yang berpengalaman, kami siap memberikan pelayanan terbaik untuk kesehatan Anda.",
    jam_operasional: "Senin - Jumat: 08:00 - 16:00",
    layanan: [
        "Pengobatan Umum",
        "Imunisasi",
        "Konsultasi Gizi",
        "Pemeriksaan Kehamilan",
        "Pelayanan Kesehatan Jiwa"
    ],
    thumbnail: "https://via.placeholder.com/100", // Ukuran thumbnail yang lebih kecil
};

const FasilitasDetail = () => {
    return (
       <>
       <br></br><br></br><br></br>
       <Container className="mt-4">
            <Card>
                <Card.Header as="h5">{fasilitas.nama}</Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <Card.Img variant="top" src={fasilitas.thumbnail} alt="Thumbnail Fasilitas" style={{ width: '100%', height: 'auto' }} />
                            <br></br>
                        </Col>
                        <Col md={8}>
                            <Card.Title className="mt-2">Detail Fasilitas Kesehatan</Card.Title>
                            <Card.Text>
                                <strong>Alamat:</strong> <br></br> {fasilitas.alamat}
                            </Card.Text>
                            <Card.Text>
                                <strong>Kontak Petugas Kesehatan:</strong> <br></br>
                                <a href={`https://wa.me/${fasilitas.cp_petugas.replace(/-/g, '')}`} target="_blank" rel="noopener noreferrer">
                                    {fasilitas.cp_petugas}
                                </a>
                            </Card.Text>
                            <Card.Text>
                                <strong>Jam Operasional:</strong> <br></br> {fasilitas.jam_operasional}
                            </Card.Text>
                        </Col>
                    </Row>
                    <Card.Text className="mt-3">
                        <strong>Deskripsi:</strong> <br></br> {fasilitas.deskripsi}
                    </Card.Text>
                    <Card.Text>
                        <strong>Layanan yang Tersedia:</strong>
                    </Card.Text>
                    <ListGroup>
                        {fasilitas.layanan.map((layanan, index) => (
                            <ListGroup.Item key={index}>{layanan}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
       </>
    );
};

export default FasilitasDetail;
