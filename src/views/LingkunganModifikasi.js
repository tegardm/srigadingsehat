import React, { useState } from 'react';
import { Form, Button, Container, ProgressBar, Card, Row, Col } from 'react-bootstrap';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../firebase/firebase';

const SekolahModifikasi = () => {
    const [formData, setFormData] = useState({
        title: '',
        thumbnail: '',
        description: '',
        schedule: '',
        additionalInfo: '',
        contactPerson: '',
        locationAddress: ''
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
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

        if (thumbnailFile) {
            const uploadTask = storage.ref(`thumbnails/${thumbnailFile.name}`).put(thumbnailFile);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Update progress bar
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setUploadProgress(progress);
                },
                (err) => {
                    console.error('Error uploading file:', err);
                    setError('File upload failed. Please try again.');
                    setIsSubmitting(false);
                },
                async () => {
                    // Upload completed, get the download URL
                    try {
                        const url = await storage
                            .ref('thumbnails')
                            .child(thumbnailFile.name)
                            .getDownloadURL();

                        // Add form data to Firestore
                        await addDoc(collection(db, 'kesehatan'), {
                            ...formData,
                            thumbnail: url,
                        });

                        alert('Data successfully submitted!');
                        setFormData({
                            title: '',
                            thumbnail: '',
                            description: '',
                            schedule: '',
                            additionalInfo: '',
                            contactPerson: '',
                            locationAddress: ''
                        });
                        setThumbnailFile(null);
                        setUploadProgress(0);
                    } catch (err) {
                        console.error('Error saving to Firestore:', err);
                        setError('Failed to save data. Please try again.');
                    } finally {
                        setIsSubmitting(false);
                    }
                }
            );
        } else {
            setError('Please select a thumbnail image.');
            setIsSubmitting(false);
        }
    };

    return (
        <>
        <br></br><br></br><br></br>
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
                                    placeholder="Enter title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formThumbnail">
                                <Form.Label>Thumbnail</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleFileChange}
                                    required
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
                    <br></br>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Enter description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <br></br>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formSchedule">
                                <Form.Label>Schedule</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter schedule"
                                    name="schedule"
                                    value={formData.schedule}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formContactPerson">
                                <Form.Label>Contact Person</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter contact person"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <br></br>

                    <Form.Group controlId="formAdditionalInfo">
                        <Form.Label>Additional Information</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Enter additional information"
                            name="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <br></br>

                    <Form.Group controlId="formLocationAddress">
                        <Form.Label>Location Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter location address"
                            name="locationAddress"
                            value={formData.locationAddress}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <br></br>

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

export default SekolahModifikasi;
