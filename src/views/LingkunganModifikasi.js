import React, { useState, useEffect } from 'react';
import { Form, Button, Container, ProgressBar, Card, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Correct Firebase Storage imports
import { storage, db } from '../firebase/firebase';

const LingkunganModifikasi = () => {
    const { idlingkungan } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        thumbnail: '',
        description: '',
        schedule: '',
        additionalInfo: '',
        contactPerson: {
            name: '',
            no: ''
        },
        dusun: '', // Added field for dusun
        locationAddress: '',
        locationGmaps: '',
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch data for the specific document
    const fetchLingkunganData = async () => {
        try {
            const docRef = doc(db, 'lingkungans', idlingkungan);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFormData(docSnap.data());
            } else {
                setError("Kegiatan tidak ditemukan");
            }
        } catch (err) {
            console.error("Error fetching document:", err);
            setError("Gagal mengambil data kegiatan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLingkunganData();
    }, [idlingkungan]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'contactPersonName' || name === 'contactPersonNo') {
            setFormData({
                ...formData,
                contactPerson: {
                    ...formData.contactPerson,
                    [name === 'contactPersonName' ? 'name' : 'no']: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setThumbnailFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const docRef = doc(db, 'lingkungans', idlingkungan);

        try {
            if (thumbnailFile) {
                const storageRef = ref(storage, `thumbnails/${thumbnailFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, thumbnailFile);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setUploadProgress(progress);
                    },
                    (error) => {
                        console.error('Error uploading file:', error);
                        setError('File upload failed. Please try again.');
                        setIsSubmitting(false);
                    },
                    async () => {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);

                        await updateDoc(docRef, {
                            ...formData,
                            thumbnail: url,
                        });

                        alert('Data successfully updated!');
                        navigate(-1);
                    }
                );
            } else {
                await updateDoc(docRef, {
                    ...formData,
                });

                alert('Data successfully updated!');
                navigate(-1);
            }
        } catch (err) {
            console.error('Error updating document:', err);
            setError('Failed to update data. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <br /><br /><br />
            <Container className="mt-4">
                <Card className="p-4 shadow-sm">
                    <h2 className="text-center mb-4">Modifikasi Data Lingkungan</h2>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formTitle">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formThumbnail">
                                    <Form.Label>Thumbnail</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    {uploadProgress > 0 && (
                                        <ProgressBar
                                            now={uploadProgress}
                                            label={`${uploadProgress}%`}
                                            className="mt-2"
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        <br />
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <br />

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formSchedule">
                                    <Form.Label>Schedule</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="schedule"
                                        value={formData.schedule}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formContactPersonName">
                                    <Form.Label>Contact Person Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contactPersonName"
                                        value={formData.contactPerson.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <br />

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formContactPersonNo">
                                    <Form.Label>Contact Person No</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contactPersonNo"
                                        value={formData.contactPerson.no}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formDusun">
                                    <Form.Label>Dusun</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="dusun"
                                        value={formData.dusun}
                                        onChange={handleChange}
                                    >
                                        
                                        <option value="krajan">Krajan</option>
                                        <option value="gading">Gading</option>
                                        <option value="mendek">Mendek</option>
                                        <option value="jeruk">Jeruk</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <br />

                        <Form.Group controlId="formLocationAddress">
                            <Form.Label>Location Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="locationAddress"
                                value={formData.locationAddress}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <br />

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                            className="w-100 mt-3"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Form>
                </Card>
            </Container>
        </>
    );
};

export default LingkunganModifikasi;
