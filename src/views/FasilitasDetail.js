import React, { useEffect, useState } from 'react';
import { Container, Card, ListGroup, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { db } from '../firebase/firebase'; // Adjust the import according to your file structure
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom'; // Assuming you're using react-router for routing

const FasilitasDetail = () => {
    const { idFasilitas } = useParams(); // Get the idFasilitas from the URL parameters
    const [fasilitas, setFasilitas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFasilitas = async () => {
            try {
                const docRef = doc(db, 'fasilitas', idFasilitas); // Reference to the document
                const docSnap = await getDoc(docRef); // Fetch the document

                if (docSnap.exists()) {
                    setFasilitas(docSnap.data()); // Set the fetched data
                } else {
                    setError("Fasilitas tidak ditemukan.");
                }
            } catch (err) {
                setError("Terjadi kesalahan saat mengambil data.");
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        fetchFasilitas();
    }, [idFasilitas]); // Run the effect when idFasilitas changes

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!fasilitas) {
        return <Alert variant="warning">Data fasilitas tidak tersedia.</Alert>;
    }

    return (
        <>
        <br></br><br></br><br></br>
            <Container className="mt-4">
                <Card>
                    <Card.Header as="h5">{fasilitas.nama}</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={4}>
                                <Card.Img
                                    variant="top"
                                    src={fasilitas.thumbnail}
                                    alt="Thumbnail Fasilitas"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </Col>
                            <Col md={8}>
                                <Card.Title className="mt-2">Detail Fasilitas Kesehatan</Card.Title>
                                <Card.Text>
                                    <strong>Alamat:</strong> <br /> {fasilitas.alamat}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Kontak Petugas Kesehatan:</strong> <br />
                                    <a href={`https://wa.me/${fasilitas.cp_petugas.replace(/-/g, '')}`} target="_blank" rel="noopener noreferrer">
                                        {fasilitas.cp_petugas}
                                    </a>
                                </Card.Text>
                                <Card.Text>
                                    <strong>Jam Operasional:</strong> <br />
                                    <ul>
                                        {fasilitas.jam_operasional.hariBuka.map((hari, index) => (
                                            <li key={index}>
                                                {hari}: {fasilitas.jam_operasional.waktuBuka} - {fasilitas.jam_operasional.waktuTutup}
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Text>
                            </Col>
                        </Row>
                        <Card.Text className="mt-3">
                            <strong>Deskripsi:</strong> <br /> {fasilitas.deskripsi}
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
