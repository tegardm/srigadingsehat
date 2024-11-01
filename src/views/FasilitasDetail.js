import React, { useEffect, useState } from 'react';
import { Container, Card, ListGroup, Row, Col, Spinner, Alert, Button, Table } from 'react-bootstrap';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const FasilitasDetail = () => {
    const { idFasilitas } = useParams();
    const [fasilitas, setFasilitas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFasilitas = async () => {
            try {
                const docRef = doc(db, 'fasilitas', idFasilitas);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFasilitas(docSnap.data());
                } else {
                    setError("Fasilitas tidak ditemukan.");
                }
            } catch (err) {
                setError("Terjadi kesalahan saat mengambil data.");
            } finally {
                setLoading(false);
            }
        };

        fetchFasilitas();
    }, [idFasilitas]);

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" size="lg" />
                <p className="mt-3">Memuat data fasilitas...</p>
            </Container>
        );
    }

    if (error) {
        return <Alert variant="danger" className="my-4 text-center">{error}</Alert>;
    }

    if (!fasilitas) {
        return <Alert variant="warning" className="my-4 text-center">Data fasilitas tidak tersedia.</Alert>;
    }

    return (
       <>
       <br/><br/>
        <Container className="mt-5 mb-5">
            <Card className="shadow-lg border-0 rounded-3">
                <Card.Header className="bg-dark text-white text-center">
                    <h3>{fasilitas.nama}</h3>
                </Card.Header>
                <Card.Body className="p-4">
                    <Row className="align-items-center">
                        {/* Section Thumbnail */}
                        <Col md={5} className="text-center">
                            <Card.Img
                                src={fasilitas.thumbnail}
                                alt="Thumbnail Fasilitas"
                                className="rounded mb-4"
                                style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
                            />
                         
                        </Col>

                        {/* Section Detail Info */}
                        <Col md={7}>
                            <h4 className="text-primary mb-3">Detail Fasilitas Kesehatan</h4>
                            <Card.Text className="text-secondary mb-2">
                                <strong>Alamat:</strong><br /> {fasilitas.alamat}
                            </Card.Text>
                            <Card.Text className="text-secondary mb-2">
                                <strong>Kontak Petugas Kesehatan:</strong><br />
                                <a
                                    href={`https://wa.me/${fasilitas.cp_petugas.replace(/-/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-decoration-none text-success"
                                >
                                    {fasilitas.cp_petugas}
                                </a>
                            </Card.Text>
                            
                            {/* Jam Operasional Table */}
                            <strong><p className="text-secondary mt-4">Jam Operasional</p></strong>
                            <Table bordered responsive="md" className="text-small mt-2">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Hari</th>
                                        <th>Waktu Buka</th>
                                        <th>Waktu Tutup</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fasilitas.jam_operasional.hariBuka.map((hari, index) => (
                                        <tr key={index}>
                                            <td>{hari}</td>
                                            <td>{fasilitas.jam_operasional.waktuBuka}</td>
                                            <td>{fasilitas.jam_operasional.waktuTutup}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    {/* Section Deskripsi */}
                    <Row className="mt-4">
                        <Col>
                            <h5 className="text-secondary mb-3">Deskripsi</h5>
                            <Card.Text>{fasilitas.deskripsi}</Card.Text>
                        </Col>
                    </Row>

                    {/* Section Layanan */}
                    <Row className="mt-4">
                        <Col>
                            <h5 className="text-secondary mb-3">Layanan yang Tersedia</h5>
                            <ListGroup variant="flush" className="border rounded">
                                {fasilitas.layanan.map((layanan, index) => (
                                    <ListGroup.Item key={index} className="py-3">
                                        {layanan}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                    </Row>

                    {/* Kembali ke Daftar Button */}
                    <div className="text-center mt-4">
                        <Button variant="primary" href="/admin/fasilitas" className="px-4">
                            Kembali ke Daftar Fasilitas
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
       </>
    );
};

export default FasilitasDetail;
